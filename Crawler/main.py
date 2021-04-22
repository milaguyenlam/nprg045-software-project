from queue import Queue
from threading import Thread
from time import sleep

from lib.executor import Executor
from lib.Helpers.helpers import config, get_logger
from lib.Helpers.server_communication import sender_worker
from lib.Scrapers.MakroScraper import MakroScraper as Mk

# TODO: automatic debug log
logger = get_logger(__name__)

# TODO: Indefinite sleep with keyboard interrupt?
TESTING_MODE = config.getboolean("main", "testing mode")
INITIAL_SLEEP_PERIOD = config.getint("main", "initial sleep period")
logger.info(
    f"Placing Crawler under initial sleep period of {INITIAL_SLEEP_PERIOD} second{'s' if INITIAL_SLEEP_PERIOD != 1 else ''}")
sleep(INITIAL_SLEEP_PERIOD)  # HACK: waiting for DB to fully initialize

REST_PERIOD = config.getint("main", "rest period")
FAIL_PERIOD = config.getint("main", "fail period")

scrapers = [Mk()]
executors = []
scraped_data_holder = Queue()
for scraper in scrapers:
    executors.append(Executor(scraper, scraped_data_holder, REST_PERIOD,
                              FAIL_PERIOD, testing_mode=TESTING_MODE))  # HACK: temp testing_mode = True

for executor in executors:
    executor.start()

scraped_data_handler = Thread(
    target=sender_worker, args=(scraped_data_holder,), daemon=True)
scraped_data_handler.start()
