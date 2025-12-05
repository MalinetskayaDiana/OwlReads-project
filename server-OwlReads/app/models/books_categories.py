from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class BookCategory(Base):
    __tablename__ = "books_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    reviews = relationship("UserBookReview", back_populates="category")
