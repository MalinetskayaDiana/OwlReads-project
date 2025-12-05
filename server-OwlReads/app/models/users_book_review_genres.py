from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserBookReviewGenre(Base):
    __tablename__ = "users_book_review_genres"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)
    genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False)

    review = relationship("UserBookReview", back_populates="genres")
    genre = relationship("Genre", back_populates="reviews")
