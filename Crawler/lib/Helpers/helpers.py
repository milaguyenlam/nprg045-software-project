import configparser
import csv
import json
import logging
import os
from pathlib import Path
from collections import namedtuple

import pandas
import requests

from lib.Exceptions.Exceptions import BadResponse

# READING FROM CONFIG
config = configparser.ConfigParser(inline_comment_prefixes="#")
config_file_path = Path(f"{os.getcwd()}/config/config.ini")
config.read(config_file_path)


BASE_URL = config.get("helpers", "geocode base url")
API_KEY = config.get("helpers", "geocode api key")

# ------------------------- HELPERS ------------------------- #
DataPackage = namedtuple(
    "DataPackage", "data vendor_name store_name category_name is_fresh")


def load_json_file(path):
    with open(path, "r", encoding="utf8") as json_file:
        data = json.load(json_file)
    return data


def dump_to_json_file(data, path):
    with open(path, "w", encoding="utf8") as json_file:
        json.dump(data, json_file, default=lambda x: x.dict(),
                  indent=4, ensure_ascii=False)


def to_json(data, **kwargs):
    return json.dumps(data, default=lambda x: x.dict(), indent=4, **kwargs)


# TODO: handle non-decimal prices
def format_to_float(price: str) -> float:
    stripped_price = price.strip()
    price_chars = (char if char.isdigit()
                   else " " for char in list(stripped_price))
    price_parts = "".join(price_chars).strip().rsplit(maxsplit=1)
    dirty_price = ".".join(price_parts)
    clean_price = dirty_price.replace(" ", "")

    return float(clean_price)


def geocode(address):
    parameters = {
        'key': API_KEY,
        'address': address
    }

    response = requests.get(BASE_URL, params=parameters)

    if response.ok:
        geometry = response.json()['results'][0]['geometry']
        location = geometry['location']
        latitude: float = location['lat']
        longitude: float = location['lng']

        return latitude, longitude
    else:
        raise BadResponse


def get_logger(name):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    LOG_FORMAT = "%(levelname)s:%(asctime)s:%(name)s:%(message)s"
    formatter = logging.Formatter(LOG_FORMAT)

    log_file_directory = Path(f"{os.getcwd()}/_server/_logs/")
    if not os.path.exists(log_file_directory):
        os.makedirs(log_file_directory)
    log_file_path = Path(f"{log_file_directory}/Crawler.log")

    file_handler = logging.FileHandler(log_file_path)
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

    return logger


def nameof(instance: object) -> str:
    """Returns the name of the type/class of the passed object

    Args:
        instance (object): any object, but an instance of an exception is the expected use case

    Returns:
        str: name of the type/class of the instance
    """
    return type(instance).__name__


def load_csv(path):
    with open(path, encoding="utf8") as csv_file:
        list_of_dicts = []
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            # deletes the numbering column, because it would get duplicated when creating the csv file again from the list of dictionaries
            del row['']
            list_of_dicts.append(row)

        return list_of_dicts


def dump_to_csv(data, path):
    pandas.DataFrame(data).to_csv(path)
