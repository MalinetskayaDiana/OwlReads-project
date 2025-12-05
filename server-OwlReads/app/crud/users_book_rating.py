from sqlalchemy.orm import Session
from app.models.users_book_rating import UserBookRating
from app.schemas.users_book_rating import UserBookRatingCreate

def create_rating(db: Session, rating: UserBookRatingCreate):
    db_rating = UserBookRating(**rating.dict())
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

def get_ratings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserBookRating).offset(skip).limit(limit).all()

def get_rating(db: Session, rating_id: int):
    return db.query(UserBookRating).filter(UserBookRating.id == rating_id).first()
