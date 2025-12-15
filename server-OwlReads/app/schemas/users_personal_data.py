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

class UserVerifyEmail(BaseModel):
    email: EmailStr
    code: str

class UserPersonalData(UserPersonalDataBase):
    id: int
    registered_at: datetime
    updated_at: datetime
    is_verified: bool

    class Config:
        from_attributes = True