from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserReadingRecord(Base):
    __tablename__ = "users_reading_records"

    id = Column(Integer, primary_key=True, index=True)

    # связь c users_book_review
    review_id = Column(Integer, ForeignKey("users_book_review.id"), nullable=False)

    start_date = Column(Date, nullable=True)   # дата начала (может быть пустой)
    end_date = Column(Date, nullable=True)     # дата конца (может быть пустой)

    result = Column(String(50), nullable=False)  # Брошено / Завершено / В процессе
    comment = Column(Text, nullable=True)

    review = relationship("UserBookReview", back_populates="reading_records")