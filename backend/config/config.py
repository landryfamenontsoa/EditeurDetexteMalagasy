import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    SECRET_KEY = os.getenv("SECRET_KEY", "changeme")
    JSON_SORT_KEYS = False
    # Add other configuration values here
