import os
import chardet
import sys
import pandas as pd


def get_providers():
    providers_file_name = os.path.realpath(
        os.path.join(os.path.dirname(__file__), "../../data/providers.csv")
    )
    try:
        with open(providers_file_name, 'rb') as file:
            raw_data = file.read()
            result = chardet.detect(raw_data)
            encoding = result['encoding']

        result = pd.read_csv(providers_file_name, encoding=encoding)
    except FileNotFoundError:
        print(
            "Ensure providers CSV exists. Expected providers CSV at the following path:\n\n"
            f"{providers_file_name}\n"
        )
        sys.exit()

    return result.dropna(how="all")


if __name__ == "__main__":
    get_providers()
