from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserChallengeBookOfYear(Base):
    __tablename__ = "users_challenge_book_of_year"

    id = Column(Integer, primary_key=True, index=True)

    # связь с users_challenges
    challenge_id = Column(Integer, ForeignKey("users_challenges.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)

    # связь c users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)

    month = Column(Integer, nullable=True)   # месяц (1–12)
    stage = Column(String(50), nullable=False)  # этап: month/pair/group/final
    is_winner = Column(Boolean, default=False)

    challenge = relationship("UserChallenge", back_populates="book_of_year_entries")
    user = relationship("UserPersonalData", back_populates="book_of_year_challenges")
    review = relationship("UserBookReview", back_populates="book_of_year_challenges")
