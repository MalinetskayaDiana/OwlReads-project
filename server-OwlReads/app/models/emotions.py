from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    image_code = Column(String(100), nullable=True)
    color = Column(String(7), nullable=False, server_default="#AB66FF")

    reviews = relationship("UserBookReviewEmotion", back_populates="emotion")