from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class PopularQuote(Base):
    __tablename__ = "popular_quotes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    book_title = Column(String(255), nullable=False)
