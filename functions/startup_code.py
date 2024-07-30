import os
from dotenv import load_dotenv

load_dotenv()


def get_conn_string():
    driver = os.getenv("DRIVER")
    server = os.getenv("SERVER")
    db = os.getenv("DATABASE")
    username = os.getenv("USER_NAME")
    password = os.getenv("PASSWORD")
    return f"DRIVER={{{driver}}};SERVER={server};DATABASE={db};UID={username};PWD={password}"
