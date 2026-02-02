import json


def load_spaces(data_path: str):
    with open(data_path, "r") as file:
        return json.load(file)
