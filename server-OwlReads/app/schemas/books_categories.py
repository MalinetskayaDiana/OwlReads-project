from pydantic import BaseModel

class BookCategoryBase(BaseModel):
    name: str

class BookCategoryCreate(BookCategoryBase):
    pass

class BookCategory(BookCategoryBase):
    id: int

    class Config:
        orm_mode = True
