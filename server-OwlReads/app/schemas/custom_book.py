from pydantic import BaseModel
from typing import Optional

class BookManualCreate(BaseModel):
    title: str
    author: str
    pages: Optional[int] = None
    year: Optional[int] = None
    language: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    category_name: str
    isbn: Optional[str] = None