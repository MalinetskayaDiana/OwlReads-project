from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserStatistics(Base):
    __tablename__ = "users_statistics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)

    books_in_library = Column(Integer, default=0)
    books_read = Column(Integer, default=0)
    books_favorites = Column(Integer, default=0)
    favorite_author = Column(String(255), nullable=True)
    favorite_genre = Column(String(100), nullable=True)

    user = relationship("UserPersonalData", back_populates="statistics")
