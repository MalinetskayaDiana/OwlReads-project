from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FriendAdd(BaseModel):
    friend_uid: str  # Будем добавлять по UID, который мы сделали


class FriendUpdateNickname(BaseModel):
    custom_nickname: str


class FriendRead(BaseModel):
    id: int
    friend_id: int
    friend_username: str  # Настоящий ник
    custom_nickname: Optional[str]  # Кастомный ник
    friend_uid: str
    friend_photo: Optional[str]

    class Config:
        from_attributes = True