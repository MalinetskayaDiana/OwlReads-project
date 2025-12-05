from pydantic import BaseModel
from datetime import datetime

class UserBookNoteBase(BaseModel):
    text: str

class UserBookNoteCreate(UserBookNoteBase):
    pass

class UserBookNote(UserBookNoteBase):
    id: int
    date: datetime

    class Config:
        orm_mode = True
