# app/crud/users_book_rating.py
from sqlalchemy.orm import Session
from app.models.users_book_rating import UserBookRating
from app.schemas.users_book_rating import UserBookRatingCreate


def create_rating(db: Session, rating: UserBookRatingCreate):
    # Ищем, есть ли уже рейтинг у этого отзыва
    existing_rating = db.query(UserBookRating).filter(UserBookRating.review_id == rating.review_id).first()

    if existing_rating:
        # ОБНОВЛЕНИЕ: Если нашли, меняем поля
        rating_data = rating.dict(exclude_unset=True)
        for key, value in rating_data.items():
            setattr(existing_rating, key, value)

        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # СОЗДАНИЕ: Если не нашли, создаем новый
        db_rating = UserBookRating(**rating.dict())
        db.add(db_rating)
        db.commit()
        db.refresh(db_rating)
        return db_rating


def get_ratings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserBookRating).offset(skip).limit(limit).all()


def get_rating(db: Session, rating_id: int):
    return db.query(UserBookRating).filter(UserBookRating.id == rating_id).first()