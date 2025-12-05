from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class UserBookQuote(Base):
    __tablename__ = "users_book_quotes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    quote_author = Column(String(255), nullable=True)

    # связь с users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)

    date = Column(DateTime, default=datetime.utcnow)


    review = relationship("UserBookReview", back_populates="quotes")


