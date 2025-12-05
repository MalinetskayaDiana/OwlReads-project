from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserChallengeBooksAlphabet(Base):
    __tablename__ = "users_challenge_books_alphabet"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("users_challenges.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)

    # связь c users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)

    letter = Column(String(1), nullable=False)

    challenge = relationship("UserChallenge", back_populates="alphabet_entries")
    user = relationship("UserPersonalData", back_populates="alphabet_challenges")
    review = relationship("UserBookReview", back_populates="alphabet_challenges")


