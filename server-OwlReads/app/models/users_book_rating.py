from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserBookRating(Base):
    __tablename__ = "users_book_rating"

    id = Column(Integer, primary_key=True, index=True)

    # связь c users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), unique=True, nullable=False)

    total_rating = Column(Integer, nullable=False)
    characters_rating = Column(Integer, nullable=True)
    plot_rating = Column(Integer, nullable=True)
    relations_rating = Column(Integer, nullable=True)
    emotionality_rating = Column(Integer, nullable=True)
    ending_rating = Column(Integer, nullable=True)
    easy_reading_rating = Column(Integer, nullable=True)

    review = relationship("UserBookReview", back_populates="rating")
