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

    # многие ко многим через join-таблицу
    genres = relationship("UserBookReviewGenre", back_populates="review")

    # один к одному (см. примечание ниже про unique FK в дочерних таблицах)
    rating = relationship("UserBookRating", back_populates="review", uselist=False)
    top_characters = relationship("UserTopCharacters", back_populates="review", uselist=False)

    # один ко многим
    quotes = relationship("UserBookQuotes", back_populates="review")
    notes = relationship("UserBookNotes", back_populates="review")
    reading_records = relationship("UserReadingRecords", back_populates="review")
    alphabet_challenges = relationship("UserChallengeBooksAlphabet", back_populates="review")
    book_of_year_challenges = relationship("UserChallengeBookOfYear", back_populates="review")

