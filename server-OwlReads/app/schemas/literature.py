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
        from_attributes = True


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
        from_attributes = True

class BookSearchResponse(BaseModel):
    id: int
    title: str
    author: str
    cover_url: Optional[str] = None
    year: Optional[int] = None
    isbn: Optional[str] = None
    description: Optional[str] = None
    pages: Optional[int] = None
    language: Optional[str] = None

    # Поле, чтобы фронт понимал, что это книга из нашей БД
    source: str = "local"

    class Config:
        from_attributes = True