from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_USER: str = "owlreads_admin"
    POSTGRES_PASSWORD: str = "D83xCEchx2C6YaU"
    POSTGRES_DB: str = "owlreads_db"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DATABASE_URL: str | None = None

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"

    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.POSTGRES_DB}"
        )

settings = Settings()
