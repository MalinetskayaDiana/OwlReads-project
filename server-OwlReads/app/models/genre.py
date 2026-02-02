from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    color = Column(String(7), nullable=False, server_default="#AB66FF")

    reviews = relationship("UserBookReviewGenre", back_populates="genre")


