from sqlalchemy.orm import Session
from app.models.books_categories import BookCategory
from app.schemas.books_categories import BookCategoryCreate

def create_category(db: Session, category: BookCategoryCreate):
    db_category = BookCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(BookCategory).offset(skip).limit(limit).all()

def get_category_by_name(db: Session, name: str):
    return db.query(BookCategory).filter(BookCategory.name == name).first()
