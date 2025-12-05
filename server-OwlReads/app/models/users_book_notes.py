from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class UserBookNote(Base):
    __tablename__ = "users_book_notes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)

    # связь с users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)

    date = Column(DateTime, default=datetime.utcnow)

    review = relationship("UserBookReview", back_populates="notes")
