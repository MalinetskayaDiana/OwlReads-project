from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class UserChallenge(Base):
    __tablename__ = "users_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)

    challenge_type = Column(String(50), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="В процессе")

    user = relationship("UserPersonalData", back_populates="challenges")
    alphabet_entries = relationship("UserChallengeBooksAlphabet", back_populates="challenge")
    book_of_year_entries = relationship("UserChallengeBookOfYear", back_populates="challenge")
