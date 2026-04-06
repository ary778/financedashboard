from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    # SQLite connection
    DATABASE_URL: str = f"sqlite+aiosqlite:///{Path(__file__).parent / 'finance_db.sqlite'}"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()