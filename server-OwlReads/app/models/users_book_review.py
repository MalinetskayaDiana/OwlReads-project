from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class UserBookReview(Base):
    __tablename__ = "users_book_review"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users_personal_data.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books_editions.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("books_categories.id"), nullable=False)

    # связи
    user = relationship("UserPersonalData", back_populates="book_reviews")
    category = relationship("BookCategory", back_populates="reviews")

    rating = relationship("UserBookRating", back_populates="review", uselist=False, cascade="all, delete-orphan")
    top_characters = relationship("UserTopCharacters", back_populates="review", uselist=False,
                                  cascade="all, delete-orphan")

    quotes = relationship("UserBookQuote", back_populates="review", cascade="all, delete-orphan")
    notes = relationship("UserBookNote", back_populates="review", cascade="all, delete-orphan")
    reading_records = relationship("UserReadingRecord", back_populates="review", cascade="all, delete-orphan")
    alphabet_challenges = relationship("UserChallengeBooksAlphabet", back_populates="review",
                                       cascade="all, delete-orphan")
    book_of_year_challenges = relationship("UserChallengeBookOfYear", back_populates="review",
                                           cascade="all, delete-orphan")

    # Для жанров (так как это связующая таблица) тоже нужен каскад
    genres = relationship("UserBookReviewGenre", back_populates="review", cascade="all, delete-orphan")
