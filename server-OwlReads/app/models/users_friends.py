from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class UserFriend(Base):
    __tablename__ = "users_friends"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)

    custom_nickname = Column(String(50), nullable=True)

    # Статус (на будущее: pending - ожидает, accepted - друзья)
    status = Column(String(20), default="accepted")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Связи
    user = relationship("UserPersonalData", foreign_keys=[user_id])
    friend = relationship("UserPersonalData", foreign_keys=[friend_id])

    # Ограничение: нельзя добавить одного и того же человека дважды
    __table_args__ = (UniqueConstraint('user_id', 'friend_id', name='_user_friend_uc'),)