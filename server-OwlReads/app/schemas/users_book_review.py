# app/schemas/users_book_review.py
from typing import List, Optional
from pydantic import BaseModel
from .books_categories import BookCategory
from .users_book_rating import UserBookRating
from .users_book_quotes import UserBookQuote
from .users_book_notes import UserBookNote

class UserBookReviewBase(BaseModel):
    user_id: int
    book_id: int
    category_id: int

class UserBookReviewCreate(UserBookReviewBase):
    pass

class UserBookReview(UserBookReviewBase):
    id: int
    category: BookCategory
    rating: Optional[UserBookRating] = None
    quotes: List[UserBookQuote] = []
    notes: List[UserBookNote] = []

    class Config:
        from_attributes = True
