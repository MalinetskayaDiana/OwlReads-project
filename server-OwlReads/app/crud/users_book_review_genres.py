from sqlalchemy.orm import Session
from app.models.users_book_review_genres import UserBookReviewGenre
from app.schemas.users_book_review_genres import UserBookReviewGenreCreate

def create_review_genre(db: Session, entry: UserBookReviewGenreCreate):
    db_entry = UserBookReviewGenre(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_review_genres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserBookReviewGenre).offset(skip).limit(limit).all()

def get_review_genre(db: Session, entry_id: int):
    return db.query(UserBookReviewGenre).filter(UserBookReviewGenre.id == entry_id).first()
