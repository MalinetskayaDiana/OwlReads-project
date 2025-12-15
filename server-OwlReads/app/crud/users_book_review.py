# app/crud/users_book_review.py
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.users_book_review import UserBookReview
from app.schemas.users_book_review import UserBookReviewCreate

def create_review(db: Session, review: UserBookReviewCreate) -> UserBookReview:
    db_review = UserBookReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(UserBookReview)
        .options(
            joinedload(UserBookReview.category),
            joinedload(UserBookReview.rating),
            joinedload(UserBookReview.user),
            joinedload(UserBookReview.quotes),
            joinedload(UserBookReview.notes)
            # Добавь joinedload для всех полей, которые нужны в ответе
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
def get_review_by_id(db: Session, review_id: int):
    return db.query(UserBookReview).filter(UserBookReview.id == review_id).first()

def get_user_reviews_by_category_name(db: Session, user_id: int, category_name: str):
    return (
        db.query(UserBookReview)
        .join(UserBookReview.category)
        .filter(UserBookReview.user_id == user_id)
        .filter(UserBookReview.category.has(name=category_name))
        .all()
    )

def delete_review(db: Session, review_id: int) -> bool:
    obj = db.query(UserBookReview).filter(UserBookReview.id == review_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
