from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

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

# app/schemas/users_personal_data.py

class UserPersonalDataUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    old_password: Optional[str] = None
    password: Optional[str] = None  # Передаем обычный пароль, захешируем в CRUD
    profile_photo: Optional[str] = None