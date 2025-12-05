# app/schemas/users_book_review.py
from pydantic import BaseModel

class UserBookReviewBase(BaseModel):
    user_id: int
    book_id: int
    category_id: int

class UserBookReviewCreate(UserBookReviewBase):
    pass

class UserBookReview(UserBookReviewBase):
    id: int

    class Config:
        orm_mode = True
