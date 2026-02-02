from pydantic import BaseModel

class BookCategoryBase(BaseModel):
    name: str
    color: str

class BookCategoryCreate(BookCategoryBase):
    pass

class BookCategory(BookCategoryBase):
    id: int
    color: str

    class Config:
        from_attributes = True
