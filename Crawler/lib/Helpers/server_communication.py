
import os
from datetime import datetime
from pathlib import Path
from queue import Empty, Queue
from threading import Thread
from time import sleep

import requests
from lib.Exceptions import BadResponse
from lib.Helpers.helpers import (DataPackage, config, dump_to_json_file, get_logger,
                                 load_json_file, nameof, to_json)

logger = get_logger(__name__)

MAX_EXCEPTIONS_IN_A_ROW = config.getint("server communication", "sender worker max exceptions in a row")
SLEEP_PERIOD = config.getint("server communication", "cache worker sleep period")
GET_TIMEOUT = config.getint("server communication", "cache worker get unsent timeout")

# ------------------------- SERVER COMMUNICATION ------------------------- #
def return_base_data(request: str, vendor_name):
    path = Path(f"{os.getcwd()}/data/{vendor_name}/{request}.json")
    base_data = load_json_file(path)
    return base_data

def store_base_data(data, request: str, vendor_name):
    directory = Path(f"{os.getcwd()}/data/{vendor_name}/")
    if not os.path.exists(directory):
        os.makedirs(directory)
    path = Path(f"{directory}/{request}.json")
    dump_to_json_file(data, path)
    logger.info(f"---------- {vendor_name}: Scraping and storing {request} successful ----------")


def sender_worker(data_holder: Queue):
    unsent_data_holder = Queue()
    cache_handler = Thread(target=cache_worker, args=(data_holder, unsent_data_holder), daemon=True)
    cache_handler.start()

    exceptions_in_a_row = 0
    while True:
        data_package = data_holder.get()
        data = data_package[0]
        vendor_name, store_name, category_name = data_package[1], data_package[2], data_package[3]
        is_fresh = data_package[4]
        culprit = f"{vendor_name}, {store_name}, {category_name}"
        try:
            send_to_server(data, vendor_name, store_name, category_name, is_fresh)
        except Exception as e:
            if exceptions_in_a_row < MAX_EXCEPTIONS_IN_A_ROW:
                logger.exception(f"{culprit}: Dispatching of offers failed!")
                exceptions_in_a_row += 1
            else:
                logger.error(f"{culprit}: Dispatching of offers failed!\n"
                        f"{nameof(e)}: {e}")
            unsent_data_holder.put(data_package)
        else:
            exceptions_in_a_row = 0

def cache_worker(data_holder: Queue, unsent_data_holder: Queue):
    while True:
        load_from_cache(data_holder)
        files_cached = 0
        while True:
            try:
                data_package = unsent_data_holder.get(timeout=GET_TIMEOUT)
            except Empty:
                if data_holder.empty():
                    break
                continue
            cache_data(*data_package[:4])
            files_cached += 1
        logger.info(f"CACHE HANDLER: {files_cached} files cached")
        logger.info(f"CACHE HANDLER: Initiating sleeping period of {SLEEP_PERIOD} seconds")
        sleep(SLEEP_PERIOD)

def send_to_server(data, vendor_name, store_name, category_name, is_fresh):
    culprit = f"{vendor_name}, {store_name}, {category_name}"
    data_freshness = "fresh" if is_fresh else "cached"
    serialized_data = to_json(data)
    # TODO: post retries?
    # TODO: validation error should lead to discarding the files, not caching them
    url = os.environ['API_URL']
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    logger.info(f"{culprit}: Attempting to post {data_freshness} data on server...")
    try:
        response = requests.post(url, timeout=35, data=serialized_data, verify=False, headers=headers) # FIXME: temporary verify=False
    except (requests.exceptions.ConnectionError, requests.exceptions.Timeout,
                requests.Timeout, ConnectionError, TimeoutError) as e:
        raise e
    else:
        if not response.ok:
            raise BadResponse(f"{culprit}: {response.status_code} {response.reason}") # TODO: add response message
        else:
            logger.info(f"{culprit}: Successfully posted on server")

def cache_data(data, vendor_name, store_name, category_name):
    cache_directory = Path(f"{os.getcwd()}/_server/_offers/{vendor_name}/{store_name}/{category_name}")
    if not os.path.exists(cache_directory):
        os.makedirs(cache_directory)
    cache_path = Path(f"{cache_directory}/{str(datetime.today())}.json")
    
    dump_to_json_file(data, cache_path)
    logger.warning(f"{vendor_name}, {store_name}, {category_name}: "
                    f'Unsent data cached as "{cache_path}"')

def load_from_cache(data_holder): # log how many unsent jsons are enqueued
    cache_path = Path(f"{os.getcwd()}/_server/_offers/")
    json_paths = cache_path.glob("**/*.json")
    files_loaded = 0
    for path in json_paths:
        path_segments = str(path).rsplit("/", 4)
        try:
            data_package = DataPackage(data=load_json_file(path), vendor_name=path_segments[1],
                        store_name=path_segments[2], category_name=path_segments[3], is_fresh=False)
        except Exception as e:
            logger.exception(f"CACHE HANDLER: {nameof(e)}: {path}")
            continue
        data_holder.put(data_package)
        path.unlink()
        files_loaded += 1
    logger.info(f"CACHE HANDLER: Enqueued {files_loaded} cached files for dispatch")
