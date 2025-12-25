from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBookNoteBase(BaseModel):
    text: str

class UserBookNoteCreate(UserBookNoteBase):
    review_id: int

class UserBookNote(UserBookNoteBase):
    id: int
    review_id: int
    date: Optional[datetime] = None

    class Config:
        from_attributes = True