from datetime import datetime
from queue import Queue
from threading import Lock, Thread

import lib.Helpers.server_communication as sc
import requests
from bs4 import BeautifulSoup
from lib.Exceptions import (FailedSessionInit, FailedToBuildPage,
                            GetFirstPageError, GetPageCountError, GetPageError,
                            GetSourceError, LoadingBaseDataError,
                            MaxRetriesReached, ParsePageError,
                            ProcessPagesError, ProductScrapeError)
from lib.Helpers.helpers import DataPackage, config, get_logger, nameof

logger = get_logger(__name__)


MAX_SCRAPE_FAILS = config.getint("AbstractScraper", "max category scrape fails")


class AbstractAsyncScraper:
    pass

# ------------------------- ABSTRACT SCRAPER ------------------------- #
class AbstractScraper:

    @property
    def vendor(self):
        raise NotImplementedError("Needs to be implemented in a child class")

    def __init__(self):
        self.__session = requests.Session()
        self.__base_urls = self._load_base_urls()

    @property
    def session(self):
        return self.__session

    @property
    def base_urls(self):
        return self.__base_urls

# ------------------------- SCRAPE ------------------------- #
    def scrape(self, scraped_data_holder: Queue, detailed=False):
        self._initialize_new_session()
        stores = self._load_stores()
        categories = self._load_categories()
        for store in stores:
            fail_count = 0
            for category in categories:

                if fail_count >= MAX_SCRAPE_FAILS:
                    logger.error(f"{self.vendor}: Too many skipped categories ({MAX_SCRAPE_FAILS}) due to errors when scraping current store!")
                    raise ProductScrapeError

                culprit = f"{self.vendor}, {store['Name']}, {category['Name']}"

                logger.info(f"--- {self.vendor}: Scraping {store['Name']}, {category['Name']} ---") # log as info
                try:
                    exctracted_data = self._process_pages(store, category, detailed=detailed)
                # except GetPageCountError as e:
                #     raise e
                except ProcessPagesError as e:
                    logger.error(f"{nameof(e)}: {culprit}")
                    fail_count += 1
                    continue
                except Exception: # unexpected error skips category
                    logger.exception(f"{culprit}: Failed to scrape category!")
                    fail_count += 2
                    continue
                else:
                    logger.info(f"{culprit}: Scraping successful")
                    # can't proceed without extracted data
                    # any errors here should be considered unexpected (check and wrap should never cause scraped data to be thrown away; maybe append them to special variable and save them?)
                    try:
                        offers = self._check_and_wrap_offers(exctracted_data)
                    except Exception:
                        logger.exception(f"{culprit}: Failed to check and wrap offers!")
                        raise ProductScrapeError from None

                    scraped_data_package = DataPackage(data=offers, vendor_name=self.vendor, store_name=store['Name'],
                                                        category_name=category['Name'], is_fresh=True)
                    scraped_data_holder.put(scraped_data_package)

            logger.info(f"--- {self.vendor}: Scraping {store['Name']} successful ---")

        logger.info(f"--------- Scraping {self.vendor} complete ---------")

# ------------------------- PROCESS PAGES ------------------------- #
    # should append store and category and page number to its error message; product by name or number should be the concrete Scraper's job
    # TODO: refactor code to get all pages after getting page count and then parse them? This, however, invokes first parse after getting all pages, wasting time in case of faulty parse method
    def _process_pages(self, store, category, detailed=False):
        page_num = 1
        culprit = f"{self.vendor}, {store['Name']}, {category['Name']}"
        logger.info(f"{culprit}: Processing page {page_num}...")
        try:
            first_page = self._get_page(store, category, page_num, detailed=detailed)
        except (GetPageError, GetSourceError) as e:
            logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
            raise GetFirstPageError from e

        try:
            page_count = self._get_page_count(first_page)
        except Exception:
            logger.exception(f"{culprit}, page {page_num}: Failed to get page count")
            raise GetPageCountError from None

        extracted_data = []
        # could return more or less severe exceptions; warnings (like missing data) should be logged in the callee
        # failing to build helper variables should skip more than just one product
        # since pagination completed successfully, failing this call should not exit this method but continue
        fail_count = 0
        max_fails = 3
        try:
            page_extract = self._parse_page(first_page, store, category, detailed=detailed)
        except ParsePageError as e:
            logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
            fail_count += 1
        else: # else block prevents this line from being executed without assigning page_extract first (UnboundLocalError)
            extracted_data.extend(page_extract)

        pages = Queue()

        get_page_thread = Thread(target=self._get_page_worker, args=(culprit, store, category, page_count, pages, detailed), name=f"{culprit}: get_page worker")
        get_page_thread.start()
        logger.info(f"{get_page_thread.name} started...")
        parse_page_thread = Thread(target=self._parse_page_worker, args=(culprit, pages, store, category, extracted_data, detailed), name=f"{culprit}: parse_page worker")
        parse_page_thread.start()
        logger.info(f"{parse_page_thread.name} started...")

        get_page_thread.join()
        logger.info(f"{get_page_thread.name} finished!")
        pages.join()
        logger.info(f"{culprit}: all pages done!")
        parse_page_thread.join()
        logger.info(f"{parse_page_thread.name} finished and all tasks done!")


        # for page_num in range(2, page_count+1):

        #     if fail_count >= max_fails:
        #         logger.error(f"{culprit}: Too many errors ({max_fails}) when processing pages!")
        #         raise ProcessPagesError

        #     logger.info(f"{culprit}: Processing page {page_num}...")
        #     try:
        #         page = self._get_page(store, category, page_num, detailed=detailed)
        #     except (GetPageError, GetSourceError) as e:
        #         logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
        #         fail_count += 1
        #         continue

        #     try:
        #         page_extract = self._parse_page(page, store, category, detailed=detailed)
        #     except ParsePageError as e:
        #         logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
        #         fail_count += 1
        #         continue
        #     else:
        #         extracted_data.extend(page_extract)

        return extracted_data

# ------------------------- CHECK AND WRAP OFFERS ------------------------- #
    # adds common data elements: ScrapeTime
    # might become obsolete with the implementation of generated models
    def _check_and_wrap_offers(self, extracted_data):
        scrape_time = str(datetime.today())
        for offer in extracted_data:
            offer.ScrapeTime = scrape_time

        return extracted_data

# ------------------------- DISPATCH OFFERS ------------------------- #
    def _dispatch_offers(self, offers, store_name=None, category_name=None):
        pass


# ------------------------- GET PAGE ------------------------- #
    def _get_page_worker(self, culprit, store, category, page_count, pages, detailed=False):
        try:
            for page_num in range(2, page_count+1):
                try:
                    page = self._get_page(store, category, page_num, detailed=detailed)
                except (GetPageError, GetSourceError) as e:
                    logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
                    continue
                pages.put(page)
            # FIXME: signals last task - temporary solution
            pages.put(...)
        except Exception as e:
            logger.exception(nameof(e))
            pages.put(None)

    def _get_page(self, store, category, page_num=1, detailed=False):
        # abstract method, needs to by implemented by a final child
        raise NotImplementedError("Needs to be implemented in a child class")

# ------------------------- PARSE PAGE ------------------------- #
    def _parse_page_worker(self, culprit, pages, store, category, extracted_data, detailed=False):
        culprit = f"{self.vendor}, {store['Name']}, {category['Name']}"
        page_num = 2
        while True:
            page = pages.get()
            # FIXME: recognizes last task - temporary solution
            if page is ...:
                pages.task_done()
                break
            try:
                page_data = self._parse_page(page, store, category, detailed=detailed)
            except ParsePageError as e:
                logger.error(f"{nameof(e)}: {culprit}, page {page_num}")
                continue
            except Exception as e:
                logger.exception(f"{nameof(e)}: {culprit}, page {page_num}")
                continue
            else:
                extracted_data.extend(page_data)
            finally:
                pages.task_done()
                page_num += 1

    def _parse_page(self, page, store, category, detailed=False): # parameter 'page' isn't necessarily the whole page
        raise NotImplementedError("Needs to be implemented in a child class")

# ------------------------- GET PAGE COUNT ------------------------- #
    def _get_page_count(self, page) -> int:
        raise NotImplementedError("Needs to be implemented in a child class")

# ------------------------- BUILD PAGE SOUP ------------------------- #
    def _build_page_soup(self, source):
        try:
            page = BeautifulSoup(source.text, "html.parser")
        except Exception:
            logger.exception(f"{self.vendor}: Failed to build page")
            raise FailedToBuildPage from None
        return page

# ------------------------- GET SOURCE ------------------------- #
    # store, category, page_num arguments are passed only for the purposes of filling the error message
    # TODO: Increase timeout for Makro? Maybe not even needed when running multiple threads.
    def _get_source(self, url, cookies=None, store=None, category=None,
                     page_num=None, request_name=None):
        if category and store and page_num:
            culprit = f"{self.vendor}, {store['Name']}, {category['Name']}, page {page_num}"
        elif request_name:
            culprit = f"{self.vendor}, {request_name}"
        else:
            culprit = f"{self.vendor}" # can be more informative if a proper argument is passed to this method

        if cookies:
            self.session.cookies.update(cookies)

        max_attempts = 5 # TODO: use a library for retries
        logger.info(f"{culprit}: Attempting to get source...")
        for attempt_num in range(1, max_attempts+1):
            try:
                response = self.session.get(url, timeout=10)
            # safe to retry
            except (requests.exceptions.ConnectionError, requests.exceptions.Timeout,
                    requests.Timeout, ConnectionError, TimeoutError):
                if attempt_num < max_attempts:
                    logger.warning(f"{culprit}: Failed to get response on attempt {attempt_num}. Reconnecting...")
                    continue
                else:
                    logger.exception(f"{culprit}: Failed to get response on attempt {attempt_num}.")
            else:
                if response.ok:
                    logger.info(f"{culprit}: Attempt {attempt_num} successful")
                    return response
                else:
                    if attempt_num < max_attempts:
                        logger.warning(f"{culprit}: {response.status_code} {response.reason} on attempt {attempt_num}. Reconnecting...")
                        continue
                    else:
                        logger.error(f"{culprit}: {response.status_code} {response.reason} on attempt {attempt_num}")

        logger.error(f"{culprit}: Max request attempts of {max_attempts} failed!")
        raise MaxRetriesReached


# ------------------------- SCRAPE VENDOR URL ------------------------- #
    def _scrape_vendor_url(self): # since this method is only called when data for scraping is missing, errors here are severe and should bubble up to executor
        import re

        url = f"https://www.google.com/search?q={self.vendor}"
        source = self._get_source(url) # an error here should be reraised as method error
        page = source.text

        regex_pattern = rf"https://(www\.)?[^\.]*{self.vendor.lower()}[^\.]*\.[^/]*(/|\s)"
        match = re.search(regex_pattern, page)
        vendor_url = match.group(0) # there should probably be more methods in case one fails (though it probably won't)

        return vendor_url

# ------------------------- SCRAPE BASE URLS ------------------------- #
    def _scrape_base_urls(self):
        raise NotImplementedError("Needs to be implemented in a child class")

# ------------------------- SCRAPE STORES INFO ------------------------- #
    def _scrape_stores_info(self):
        raise NotImplementedError("Needs to be implemented in a child class")

# ------------------------- SCRAPE CATEGORIES INFO ------------------------- #
    def _scrape_categories_info(self):
        raise NotImplementedError("Needs to be implemented in a child class")


# ------------------------- LOAD BASE URLS ------------------------- #
    def _load_base_urls(self) -> dict: # a dictionary of urls
        try:
            base_urls = sc.return_base_data("base_urls", self.vendor)
        except FileNotFoundError as e:
            logger.error(f"{self.vendor}: Missing base_urls.json!\n"
                        f"FileNotFoundError: {e}")
            logger.info(f"{self.vendor}: Scraping base urls...")
            try:
                self._scrape_base_urls()
            except Exception:
                logger.exception(f"{self.vendor}: Scraping base urls failed!")
                raise LoadingBaseDataError from None
            else:
                logger.info(f"{self.vendor}: Scraping base urls successful")
                base_urls = sc.return_base_data("base_urls", self.vendor)
        return base_urls

# ------------------------- LOAD STORES ------------------------- #
    def _load_stores(self) -> list:
        try:
            stores = sc.return_base_data("stores", self.vendor)
        except FileNotFoundError as e:
            logger.error(f"{self.vendor}: Missing stores.json!\n"
                        f"{nameof(e)}: {e}")
            logger.info(f"{self.vendor}: Scraping stores info...")
            try:
                self._scrape_stores_info()
            except Exception:
                logger.exception(f"{self.vendor}: Scraping stores info failed!")
                raise LoadingBaseDataError from None
            else:
                logger.info(f"{self.vendor}: Scraping stores info successful")
                stores = sc.return_base_data("stores", self.vendor)
        return stores

# ------------------------- LOAD CATEGORIES ------------------------- #
    def _load_categories(self) -> list:
        try:
            categories = sc.return_base_data("categories", self.vendor)
        except FileNotFoundError as e:
            logger.error(f"{self.vendor}: Missing categories.json!\n"
                        f"FileNotFoundError: {e}")
            logger.info(f"{self.vendor}: Scraping categories info...")
            try:
                self._scrape_categories_info()
            except Exception:
                logger.exception(f"{self.vendor}: Scraping categories info failed!")
                raise LoadingBaseDataError from None
            else:
                logger.info(f"{self.vendor}: Scraping categories info successful")
                categories = sc.return_base_data("categories", self.vendor)
        return categories

# ------------------------- INITIALIZE NEW SESSION ------------------------- #
    def _initialize_new_session(self): # maybe check initializing the session before assigning it to self.__session
        try:
            self._get_source(self.base_urls['session_url'])
        except GetSourceError as e:
            logger.error(f"{nameof(e)}: {self.vendor}")
            raise FailedSessionInit from None
        else:
            logger.info(f"---------- {self.vendor}: Session initialized ----------")
