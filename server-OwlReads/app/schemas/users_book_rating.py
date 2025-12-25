from pydantic import BaseModel

class UserBookRatingBase(BaseModel):
    total_rating: int
    characters_rating: int | None = None
    plot_rating: int | None = None
    relations_rating: int | None = None
    emotionality_rating: int | None = None
    ending_rating: int | None = None
    easy_reading_rating: int | None = None

class UserBookRatingCreate(UserBookRatingBase):
    review_id: int

class UserBookRating(UserBookRatingBase):
    id: int
    review_id: int

    class Config:
        from_attributes = True
