from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBookQuoteBase(BaseModel):
    text: str
    quote_author: Optional[str] = None

class UserBookQuoteCreate(UserBookQuoteBase):
    review_id: int

class UserBookQuote(UserBookQuoteBase):
    id: int
    review_id: int  # И здесь полезно
    date: Optional[datetime] = None

    class Config:
        from_attributes = True