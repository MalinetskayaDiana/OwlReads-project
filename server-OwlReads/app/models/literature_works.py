from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class LiteratureWork(Base):
    __tablename__ = "literature_works"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)

    # связь с изданиями
    editions = relationship("BookEdition", back_populates="work", cascade="all, delete-orphan")
