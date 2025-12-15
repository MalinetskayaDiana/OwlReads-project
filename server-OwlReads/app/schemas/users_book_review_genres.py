from pydantic import BaseModel

class UserBookReviewGenreBase(BaseModel):
    review_id: int
    genre_id: int

class UserBookReviewGenreCreate(UserBookReviewGenreBase):
    pass

class UserBookReviewGenre(UserBookReviewGenreBase):
    id: int

    class Config:
        from_attributes = True
