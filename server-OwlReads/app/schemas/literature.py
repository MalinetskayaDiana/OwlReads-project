from pydantic import BaseModel
from typing import Optional, List

# --- LiteratureWork ---
class LiteratureWorkBase(BaseModel):
    title: str
    author: str

class LiteratureWorkCreate(LiteratureWorkBase):
    pass

class LiteratureWork(LiteratureWorkBase):
    id: int

    class Config:
        orm_mode = True


# --- BookEdition ---
class BookEditionBase(BaseModel):
    original_year: Optional[int] = None
    description: Optional[str] = None
    publisher: Optional[str] = None
    year: Optional[int] = None
    pages: Optional[int] = None
    cover_url: Optional[str] = None
    isbn: Optional[str] = None
    language: Optional[str] = None

class BookEditionCreate(BookEditionBase):
    literature_work_id: int

class BookEdition(BookEditionBase):
    id: int
    literature_work_id: int

    class Config:
        orm_mode = True
