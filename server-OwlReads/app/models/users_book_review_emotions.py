from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserBookReviewEmotion(Base):
    __tablename__ = "users_book_review_emotions"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)
    emotion_id = Column(Integer, ForeignKey("emotions.id"), nullable=False)

    review = relationship("UserBookReview", back_populates="emotions_links")
    emotion = relationship("Emotion", back_populates="reviews")