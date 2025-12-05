import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL") or os.getenv("DATABASE_URL_LOCAL")

settings = Settings()
