from pydantic import BaseModel

class UserStatisticsBase(BaseModel):
    books_in_library: int = 0
    books_read: int = 0
    books_favorites: int = 0
    favorite_author: str | None = None
    favorite_genre: str | None = None

class UserStatisticsCreate(UserStatisticsBase):
    pass

class UserStatistics(UserStatisticsBase):
    id: int

    class Config:
        orm_mode = True
