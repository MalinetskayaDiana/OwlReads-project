from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class BookEdition(Base):
    __tablename__ = "books_editions"

    id = Column(Integer, primary_key=True, index=True)
    literature_work_id = Column(Integer, ForeignKey("literature_works.id"), nullable=False)

    original_year = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    publisher = Column(String(255), nullable=True)
    year = Column(Integer, nullable=True)
    pages = Column(Integer, nullable=True)
    cover_url = Column(String(500), nullable=True)
    isbn = Column(String(20), unique=True, nullable=True)
    language = Column(String(50), nullable=True)

    # связь с произведением
    work = relationship("LiteratureWork", back_populates="editions")
