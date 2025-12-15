from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class UserPersonalData(Base):
    __tablename__ = "users_personal_data"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    agreement_accepted = Column(Boolean, default=False)
    registered_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    profile_photo = Column(String(255), nullable=True)

    # --- НОВЫЕ ПОЛЯ ---
    verification_code = Column(String(6), nullable=True)
    is_verified = Column(Boolean, default=False)
    # ------------------

    # обратные связи
    statistics = relationship("UserStatistics", back_populates="user", uselist=False)
    challenges = relationship("UserChallenge", back_populates="user")
    alphabet_challenges = relationship("UserChallengeBooksAlphabet", back_populates="user")
    book_of_year_challenges = relationship("UserChallengeBookOfYear", back_populates="user")
    book_reviews = relationship("UserBookReview", back_populates="user")