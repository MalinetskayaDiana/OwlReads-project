from pydantic import BaseModel
from datetime import date

class UserReadingRecordBase(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    result: str
    comment: str | None = None

class UserReadingRecordCreate(UserReadingRecordBase):
    pass

class UserReadingRecord(UserReadingRecordBase):
    id: int

    class Config:
        orm_mode = True
