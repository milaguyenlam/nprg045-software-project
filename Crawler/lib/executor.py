import time
from threading import Thread

from lib.Exceptions import (FailedSessionInit, LoadingBaseDataError,
                            ProductScrapeError)
from lib.Helpers.helpers import get_logger, nameof

logger = get_logger(__name__)



class Executor(Thread):
    def __init__(self, scraper, scraped_data_holder, rest_period, fail_period, testing_mode=False): # TODO: more specific fail periods?
        Thread.__init__(self)
        self._scraper = scraper
        self._scraped_data_holder = scraped_data_holder
        self._rest_period = rest_period
        self._fail_period = fail_period
        self._testing_mode = testing_mode

    def run(self):
        # TODO: catch concrete exception
        while True:
            try:
                self._scraper.scrape(self._scraped_data_holder)

            # TODO: might let the unexpected exceptions bubble up all the way or just stop the thread or make it sleep indefinitely
            except (LoadingBaseDataError, ProductScrapeError, FailedSessionInit) as e:
                logger.error(f"!!! --- {nameof(e)}: {self._scraper.vendor}: "
                            "Scraping failed to finish properly --- !!!")
                if self._testing_mode:
                    raise e
                else:
                    logger.info(f"! --- {self._scraper.vendor}: "
                                f"Initiating sleeping period of {self._fail_period} seconds --- !")
                    time.sleep(self._fail_period)

            except Exception as e:
                logger.exception(f"!!! --- Unexpected error: {self._scraper.vendor}: "
                                "Scraping failed to finish properly --- !!!")
                if self._testing_mode:
                    raise e
                else:
                    logger.info(f"! --- {self._scraper.vendor}: "
                                f"Initiating sleeping period of {self._fail_period} seconds --- !")
                    time.sleep(self._fail_period)

            else:
                logger.info(f"--- {self._scraper.vendor}: "
                            f"Initiating sleeping period of {self._rest_period} seconds ---")
                time.sleep(self._rest_period)
