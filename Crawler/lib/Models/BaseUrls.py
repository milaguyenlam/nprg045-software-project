


class BaseUrls:

    def __init__(self, vendor_url, session_url, sale_url, vendor_info_url,
                stores_info_url, categories_info_url):
        self.vendor_url = vendor_url
        self.session_url = session_url
        self.sale_url = sale_url
        self.vendor_info_url = vendor_info_url
        self.stores_info_url = stores_info_url
        self.categories_info_url = categories_info_url

    def dict(self):
        return self.__dict__
