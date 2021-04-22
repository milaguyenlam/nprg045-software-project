from collections import Counter
from datetime import datetime

from lib.Exceptions import (FailedToBuildPage, GetSourceError, ParsePageError,
                            ProductPageParseError)
from lib.Helpers.helpers import (config, format_to_float, geocode, get_logger,
                                 nameof)
from lib.Helpers.server_communication import store_base_data
from lib.Models import BaseUrls
from lib.Models.models import (Category, ContactDetails, Geolocation, Offer,
                               Producer, Product, Store, Vendor)
from lib.Scrapers.AbstractScraper import AbstractScraper

logger = get_logger(__name__)


MAX_FAILS = config.getint("MakroScraper", "max product scrape fails")


# ------------------------- MAKRO SCRAPER ------------------------- #
class MakroScraper(AbstractScraper):

    @property
    def vendor(self):
        return "Makro"

# ------------------------- GET PAGE ------------------------- #
    def _get_page(self, store, category, page_num=1, detailed=False):

        category_segment = category['Url']
        if detailed:
            options = "&view_price=s" # prices taxed
        else:
            options = "&inactionforce=1&view_price=s" # in action & prices taxed
        url = f"{category_segment}?p={page_num}{options}"
        cookies = {'storeId': store['Id']}
        source = self._get_source(url, cookies, store, category, page_num) # could be moved to the following try except block

        return self._build_page_soup(source)

# ------------------------- PARSE PAGE ------------------------- #
    def _parse_page(self, page, store, category, detailed=False):
        # failing these might be treated as a severe error and skip a whole category or even store or vendor
        v = self.vendor
        # TODO: check if page that has no products still finds product_grid (should find it and then find no products resulting in empty list being returned)
        try:
            product_grid = page.find('div', class_="mo-products mo-products-grid")
            products = product_grid.find_all('div', class_="product-layer-content")
        except Exception:
            logger.exception(f"{v}: Failed to find product grid or products in product grid")
            raise ParsePageError from None

        page_data = []
        fail_count = 0
        # TODO: create a separate method(s) and log unexpected exceptions with name of the previous product
        # probably unneeded since unexpect errors should always should always involve the first product
        for i, product in enumerate(products, start=1):
            if fail_count >= MAX_FAILS:
                logger.error(f"{v}: Too many errors ({MAX_FAILS}) when parsing for product info!")
                raise ParsePageError

            # failing these might be treated as a severe error and skip a whole page or even category or store or vendor
            try:
                product_info_wrapper = product.find('div', class_="product-info-wrapper")
                product_info = product_info_wrapper.find('div', class_="product-info")
                price_wrapper = product.find('div', class_="product-price-wrapper")
            except Exception:
                logger.exception(f"{v}: Failed to find essential product tags for product {i}")
                fail_count += 1
                continue
            else:
                if not product_info or not price_wrapper:
                    logger.error(f"{v}: Essential tags not found for product {i}!")
                    fail_count += 1
                    continue

            # ---------- Product['Name'] ----------- ; error should skip product
            try:
                product_name = product_info.h3.text.strip()
            except Exception:
                logger.exception(f"{v}: Failed to find name for product {i}")
                fail_count += 1
                continue
            else:
                if not product_name:
                    logger.error(f"{v}: Missing name for product {i}!")
                    fail_count += 1
                    continue

            # ----------- Product['Categories'] ---------- ; error should skip product
            try:
                product_cart_info = price_wrapper.find('div', class_="product-nav-row product-nav-addtocart")
                category_line = product_cart_info.button['data-parents']
                category_names = category_line.split("/")[:3] # too much granularity with all splits; TODO: exception handle overslicing
                counter = Counter(category_names)
                if counter["Pečivo"] == 1  and counter["Mražené"] == 1:
                    category_names.append("Mražené Pečivo")
                if counter["Pečivo"] == 2:
                    category_names.append("Klasické Pečivo")
                categories = [Category(Name=category_name) for category_name in category_names]
            except Exception:
                logger.exception(f"{v}: Failed to find Category for {product_name}")
                fail_count += 1
                continue

            # ----------- Offer['Source'] ----------
            try:
                product_url = product_info_wrapper.a['href'] # might move it higher
            except Exception:
                logger.exception(f"{v}: Failed to find product_url for {product_name}")
                if detailed:
                    fail_count += 1
                    continue

            # =========== NON-ESSENTIAL AND CONDITIONAL INFO SCRAPE ===========
            missing_data_message = []

            # ---------- detailed scrape: Product['Producer'] and Product['EAN'] ----------
            producer = None
            ean = None
            if detailed:
                try:
                    source = self._get_source(product_url, request_name=product_name)
                    product_page = self._build_page_soup(source)
                except (GetSourceError, FailedToBuildPage):
                    fail_count += 1
                    continue
                try:
                    details = self._parse_product_page(product_page, product_name)
                    producer = details['producer']
                    ean = details['product_ean']
                except ProductPageParseError as e:
                    logger.error(f"{nameof(e)}: {v}, {product_name}")
                    fail_count += 1
                    continue
                except Exception:
                    logger.exception(f"{v}: Failed to parse product page for {product_name}")
                    fail_count += 1
                    continue
                if not producer:
                    missing_data_message.append("Producer")
                if not ean:
                    missing_data_message.append("EAN")

            # ---------- Offer['Price'] and Offer['Description'] -----------
            main_price = None
            offer_description = None
            if not detailed:
                try:
                    price_data = price_wrapper.find('div', class_="product-price-data").find_all(recursive=False)
                except Exception: # detailed scrape logs missing price based on main_price = None
                    if not detailed:
                        logger.exception(f"{v}: Failed to find price data for {product_name}")
                        fail_count += 1
                        continue
                else:
                    units = ["kus", "jednotku", "balení"]
                    minor_price_descs = []
                    for price_row in price_data:
                        try:
                            price_label = price_row.find('div', class_="product-price-label")
                            price_unit = price_label.span.text.strip().split()[-1]
                            for unit in units:
                                if price_unit == unit:
                                    price_value = price_row.find('div', class_="product-price-value")
                                    some_price = format_to_float(price_value.text)
                                    price_unit = "kg/l" if price_unit == "jednotku" else price_unit
                                    if len(price_value['class']) == 2: # has extra label: 'product-price-value-primary', i.e. is main price
                                        main_price = some_price
                                        main_price_unit = price_unit
                                    else:
                                        minor_price = some_price
                                        minor_price_unit = price_unit
                                        minor_price_desc = f"{minor_price}Kč za {minor_price_unit}, "
                                        minor_price_descs.append(minor_price_desc)
                                    units.remove(unit)
                                    break # skipping to next price row

                            else: # no units match
                                logger.warning(f"{v}: No units matched for this price unit for {product_name}")
                                continue # moves to next price row
                        except Exception:
                            logger.exception(f"{v}: Failed to match a price row to a unit for {product_name}")
                            break
                    if main_price:
                        main_price_desc = f"uvedená cena je za {main_price_unit}" if main_price_unit != "kus" else ""
                        offer_description = f"{''.join(minor_price_descs)}{main_price_desc}".strip(", ")
                    else:
                        logger.error(f"{v}: Missing Price for {product_name}!")
                        fail_count += 1
                        continue # skip to next product
                    if not main_price:
                        missing_data_message.append("Price")
                    if not offer_description:
                        missing_data_message.append("OfferDescription")


            # ---------- Offer['ToDate'] ---------- ; proceed despite error
            to_date = None
            if main_price:
                crude_to_date = None
                try:
                    crude_to_date = product_info.find('div', class_="product-tags-primary").text.split()[-1] # TODO: might be important to not scrape expired offers (possibly checked by DB)
                except Exception:
                    logger.exception(f"{v}: Failed to find ToDate for {product_name}")
                if not crude_to_date:
                    missing_data_message.append("ToDate")
                else:
                    to_date = datetime.strptime(crude_to_date, "%d.%m.%Y").date()


            # ---------- Product['PicturePath'] ----------- ; proceed despite error (might already be in database)
            picture_path = None
            try:
                picture_path = product_info_wrapper.a.img['src']
            except Exception:
                logger.exception(f"{v}: Failed to find PicturePath for {product_name}")
            if not picture_path: # ensures warning about missing data
                missing_data_message.append("PicturePath")

            # ---------- Offer['InStockCount'] ---------- ; proceed despite error (not essential)
            in_stock_count = None
            try:
                in_stock_count = product_cart_info.button['data-available']
            except Exception:
                logger.exception(f"{v}: Failed to find InStockCount for {product_name}")
            if not in_stock_count:
                missing_data_message.append("InStockCount")

            # ==================== WRAPPING ====================
            product = Product(
                Categories = categories, Producer = producer, Name = product_name,
                Description = None, EAN = ean, PicturePath = picture_path
            )
            offer = Offer(
                Product = product, Store = Store.parse_obj(store['Store']), FromDate = None,
                ToDate = str(to_date), Description = offer_description,
                Price = main_price, DiscountRate = 0.0, InStockCount = int(in_stock_count),
                Source = product_url, ScrapeTime = None, IsTaxed=True
            )
            page_data.append(offer)
            if missing_data_message:
                # TODO: warn with specific store, category, and page number
                logger.warning(f"{v}: Failed to find or missing {', '.join(missing_data_message)}: "
                                f"{product_name} {product_url}")
        return page_data

# ------------------------- PARSE PRODUCT PAGE ------------------------- #
    def _parse_product_page(self, product_page, product_name):
        v = self.vendor
        try:
            product_section = product_page.find('section', class_="mo-content col-lg-12")
            product_content = product_section.find('div', class_="mo-detail", recursive=False)
            product_column = product_content.find('div', class_="row").find_all(recursive=False)[-1]
            product_barcode = product_column.find('div', class_="product-info-ean dropdown dropdown-manual js-dropdown-manual")
        except Exception:
            logger.exception(f"{v}: Failed to find essential tags in product page for {product_name}")
            raise ProductPageParseError from None

        ean = None
        try:
            ean_tag = product_barcode.find('span', class_="title")
        except Exception:
            logger.exception(f"{v}: Failed to find EAN for {product_name}")
            raise ProductPageParseError from None
        else:
            ean = ean_tag.text.split()[0]

        consumer_desc = product_section.find('div', class_="accordion accordion-hg js-fir") # unlikely to throw an error since product_section can't be None
        producer = None
        if not consumer_desc:
            logger.warning(f"{v}: Missing consumer description for {product_name}")
        else:
            try:
                description_row = consumer_desc.find('div', class_="row")
                description_columns = description_row.find_all(recursive=False)
                for column in description_columns:
                    description = list(column.dl.stripped_strings)
                    if "VÝROBCE" in description:
                        # no need to strip stripped strings, duh
                        producer_name = description[description.index("VÝROBCE")+1].partition(",")[0]
                        if producer_name != "Viz etiketa":
                            producer = Producer(
                                Producer = producer_name, ThumbnailPath = None
                            ) # ThumbnailPath unavailable
            except Exception:
                logger.exception(f"{v}: Failed to find Producer for {product_name}")
                raise ProductPageParseError from None

        details = {
            'product_ean': ean,
            'producer': producer
        }
        return details

# ------------------------- GET PAGE COUNT ------------------------- #
    def _get_page_count(self, page) -> int: # PaginationError descendant of ScrapingError
        pagination = page.find('ul', class_='mo-pagination pagination')
        if len(pagination.contents) == 1:
            return 1
        else:
            last_page = pagination.find('a', title='last page')
            if last_page:
                page_count = last_page.text
                return int(page_count)
            else:
                page_count = pagination.select('a[title ^= "#"]')[-1].text
                return int(page_count)


# ========================= EXTRA SCRAPES ========================= #
# ------------------------- SCRAPE BASE URLS ------------------------- #
    def _scrape_base_urls(self):
        vendor_url = self._scrape_vendor_url()
        source = self._get_source(vendor_url)
        page = self._build_page_soup(source)

        navigation_bar = page.find('ul', role="menubar", class_="menu-list")
        links = navigation_bar.find_all('a', role="link")
        for link in links:
            if "Sortiment" in link.stripped_strings:
                sale_url = link['href']
            elif "Prodejny" in link.stripped_strings:
                stores_info_url = link['href']
            else: continue

        scrollable_content = page.find('div', class_="scrollable", id="scrollable")
        about_tag = scrollable_content.find('a', text="About MAKRO")
        url = about_tag['href']
        about_source = self._get_source(url)
        about_page = self._build_page_soup(about_source)

        about_content = about_page.find('div', class_="main", role="main")
        about_rows = about_content.find_all('div', class_="row")
        for row in about_rows:
            if "Czech headquarters" in row.stripped_strings:
                vendor_info_header = row
                break
        vendor_info_row = vendor_info_header.find_next_sibling('div', class_="row")
        vendor_info_url = vendor_info_row.find('a', href=True)['href']

        base_urls = BaseUrls(vendor_url, sale_url, sale_url, vendor_info_url,
                            stores_info_url, sale_url)
        store_base_data(base_urls, "base_urls", self.vendor)


# ------------------------- SCRAPE VENDOR INFO ------------------------- #
    def _scrape_vendor_info(self):

        url = self.base_urls['vendor_info_url']
        source = self._get_source(url)
        page = self._build_page_soup(source)

        logo_tile = page.find('div', class_="m-header-logo")
        thumbnail_path_segment = logo_tile.find("img")['src']
        thumbnail_path = f"{self.base_urls['vendor_url']}{thumbnail_path_segment}"

        main_info = page.find('div', class_="main", role="main") # contains a lot of info
        stripped_segments = list(main_info.stripped_strings)
        company_name_header_index = stripped_segments.index("Název a sídlo:")
        company_name = stripped_segments[company_name_header_index+1]

        vendor = Vendor(Name=company_name, ThumbnailPath=thumbnail_path)
        return vendor

# ------------------------- SCRAPE STORES INFO WITH IDS ------------------------- #
    def _scrape_stores_info_with_ids(self):

        url = self.base_urls['sale_url']
        source = self._get_source(url)
        page = source.text

        start_string = "MS_STORES = "
        stop_string = "var need_store="
        start = page.find(start_string) + len(start_string)
        stop = page.find(stop_string)
        stores_segment = page[start:stop]

        import json
        store_info = json.loads(stores_segment)

        stores = []
        for key, value in store_info.items(): # address can also be scraped here

            if not value['stAddr']: # doesn't append the "Centralni sklad" store and the empty store
                continue

            store = {
                'Id': key,
                'Name': f"{self.vendor} {value['stName']}",
            }

            stores.append(store)

        return stores

# ------------------------- SCRAPE STORES INFO ------------------------- #
    def _scrape_stores_info(self):

        self._initialize_new_session()
        url = self.base_urls['stores_info_url']
        source = self._get_source(url)
        page = self._build_page_soup(source)

        main_content = page.find('div', class_="scrollable").find('div', class_="main")
        store_listing = main_content.find('div', id="pageph_0_contentph_0_StoreLocatorPanel")
        store_items = store_listing.find_all('div', class_="col-md-4 col-sm-6 store-item")

        vendor = self._scrape_vendor_info() # TODO: VendorInfoScrapError
        stores = []
        for store_item in store_items:
            store_url = store_item.find('div', class_="top-row").a['href']
            source = self._get_source(store_url)
            page = self._build_page_soup(source)

            page_content = page.find('div', class_="off-canvas-container")
            scrollable_content = page_content.find('div', class_="scrollable")
            store_detail_view = scrollable_content.find('div', class_="store-detail clearfix")
            sidebar = store_detail_view.find('div', class_="sidebar")
            content = store_detail_view.find('div', class_="content")

            phone_num = sidebar.find('strong', itemprop="telephone").text.strip()

            address_row = sidebar.find('div', class_="address row", recursive=False)
            street_address = " ".join(address_row.find('span', itemprop="streetAddress").text.split())
            postal_code = address_row.find('span', itemprop="postalCode").text.strip()
            city = address_row.find('span', itemprop="name").text.strip()

            latitude, longitude = geocode(f"{street_address}, {city}")
            geolocation = Geolocation(Latitude=latitude, Longitude=longitude)

            opening_hours_table = content.find('div', class_="opening-hours").table
            opening_hours_dirty = ", ".join(opening_hours_table.stripped_strings)
            opening_hours = "-".join(opening_hours_dirty.rsplit(", ", maxsplit=1))

            contact_details = ContactDetails(
                Geolocation = geolocation, Email = None, Stret = street_address,
                City = city, PostCode = postal_code, Phone = phone_num,
                Ico = None, Country = "Česká republika"
            )
            store = Store(
                Vendor = vendor, ContactDetails = contact_details,
                OpeningHours = opening_hours
            )

            stores.append(store)

        stores_with_ids = self._scrape_stores_info_with_ids()
        stores_with_ids.sort(key=lambda store: store['Name'])
        stores.sort(key=lambda store: store.ContactDetails.City)

        stores_for_scrape = []
        for store, store_with_id in zip(stores, stores_with_ids):
            store_for_scrape = {
                'Store': store,
                'Name': store_with_id['Name'],
                'Id': store_with_id['Id'],
            }
            stores_for_scrape.append(store_for_scrape)
        stores_for_scrape.sort(key=lambda store: int(store['Id']))

        store_base_data(stores_for_scrape, "stores", self.vendor)


# ------------------------- SCRAPE CATEGORIES INFO ------------------------- #
    def _scrape_categories_info(self):

        self._initialize_new_session()
        url = self.base_urls['categories_info_url']
        source = self._get_source(url)
        page = self._build_page_soup(source)

        # lvl1 categories are at the root of the category tree
        categories_info = page.find('div', {'aria-labelledby': "navbarDropdownAction"})
        lvl2_cat_row = categories_info.find('div', class_="row level3") # even empty columns have a column
        columns_of_lvl2_cat_cells = lvl2_cat_row.find_all('div', class_="col")

        categories = []
        for column_of_lvl2_cat_cells in columns_of_lvl2_cat_cells:

            lvl2_cat_cells = column_of_lvl2_cat_cells.find_all('a', class_="menu-item")
            for lvl2_cat in lvl2_cat_cells:
                lvl2_cat_name = lvl2_cat.text.strip()
                lvl2_cat_url = lvl2_cat['href'].replace("/?inactionforce=1", "")

                lvl2_cat_dict = {
                    'Name': lvl2_cat_name,
                    'Url': lvl2_cat_url,
                }
                categories.append(lvl2_cat_dict)

        store_base_data(categories, "categories", self.vendor)
