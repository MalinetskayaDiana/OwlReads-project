from pydantic import BaseModel
from datetime import datetime

class UserBookQuoteBase(BaseModel):
    text: str
    quote_author: str | None = None

class UserBookQuoteCreate(UserBookQuoteBase):
    pass

class UserBookQuote(UserBookQuoteBase):
    id: int
    date: datetime

    class Config:
        orm_mode = True
