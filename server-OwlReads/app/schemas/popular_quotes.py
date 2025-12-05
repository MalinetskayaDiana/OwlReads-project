# app/schemas/popular_quotes.py
from pydantic import BaseModel

class PopularQuoteBase(BaseModel):
    text: str
    book_title: str

class PopularQuoteCreate(PopularQuoteBase):
    pass

class PopularQuote(PopularQuoteBase):
    id: int

    class Config:
        from_attributes = True
