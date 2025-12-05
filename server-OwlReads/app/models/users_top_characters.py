from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserTopCharacters(Base):
    __tablename__ = "users_top_characters"

    id = Column(Integer, primary_key=True, index=True)

    # связь c users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), unique=True, nullable=False)

    top_1 = Column(String(255), nullable=True)
    top_2 = Column(String(255), nullable=True)
    top_3 = Column(String(255), nullable=True)
    top_4 = Column(String(255), nullable=True)
    top_5 = Column(String(255), nullable=True)

    review = relationship("UserBookReview", back_populates="top_characters")
