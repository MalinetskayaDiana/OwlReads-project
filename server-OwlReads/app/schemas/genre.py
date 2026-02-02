# app/schemas/genre.py
from pydantic import BaseModel

class GenreBase(BaseModel):
    name: str
    color: str

class GenreCreate(GenreBase):
    pass

class GenreRead(GenreBase):
    id: int
    color: str

    class Config:
        from_attributes = True
