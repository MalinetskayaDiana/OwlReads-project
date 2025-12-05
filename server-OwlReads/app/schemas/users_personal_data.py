from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserPersonalDataBase(BaseModel):
    username: str
    email: EmailStr
    password_hash: str
    agreement_accepted: bool = False
    profile_photo: str | None = None

class UserPersonalDataCreate(UserPersonalDataBase):
    pass

class UserPersonalData(UserPersonalDataBase):
    id: int
    registered_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
