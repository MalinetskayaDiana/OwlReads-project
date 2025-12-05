# app/models.py
import uuid
from sqlalchemy import Column, String, Boolean, Integer, SmallInteger, Text, TIMESTAMP, func, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(320), nullable=False, unique=True, index=True)
    password_hash = Column(String(200), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

class Book(Base):
    __tablename__ = "books"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(1000), nullable=False, index=True)
    author = Column(String(500), nullable=False, index=True)
    cover_url = Column(String(2000), nullable=True)
    pages = Column(Integer, nullable=True)
    year = Column(SmallInteger, nullable=True)
    description = Column(Text, nullable=True)
    language = Column(String(50), nullable=True)
    isbn = Column(String(32), nullable=True, unique=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False, unique=True, index=True)
    color_hex = Column(String(7), nullable=False)  # формат "#RRGGBB"

class BookGenre(Base):
    __tablename__ = "book_genres"

    book_id = Column(PG_UUID(as_uuid=True), ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    genre_id = Column("genre_id", Column(Integer, nullable=False), ForeignKey("genres.id", ondelete="CASCADE"), nullable=False)

class LibraryCategory(Base):
    __tablename__ = "library_categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    color_hex = Column(String(7), nullable=False)  # формат "#RRGGBB"