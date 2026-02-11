from sqlalchemy.orm import Session
from app.models.literature_works import LiteratureWork
from app.models.books_editions import BookEdition
from app.schemas.literature import LiteratureWorkCreate, BookEditionCreate
from sqlalchemy import or_

# --- LiteratureWork ---
def create_literature_work(db: Session, work: LiteratureWorkCreate):
    db_work = LiteratureWork(**work.dict())
    db.add(db_work)
    db.commit()
    db.refresh(db_work)
    return db_work

def get_literature_work(db: Session, work_id: int):
    return db.query(LiteratureWork).filter(LiteratureWork.id == work_id).first()

def get_literature_works(db: Session, skip: int = 0, limit: int = 100):
    return db.query(LiteratureWork).offset(skip).limit(limit).all()

def get_book_by_isbn(db: Session, isbn: str):
    return db.query(BookEdition).filter(BookEdition.isbn == isbn).first()


# --- BookEdition ---
def create_book_edition(db: Session, edition: BookEditionCreate):
    db_edition = BookEdition(**edition.dict())
    db.add(db_edition)
    db.commit()
    db.refresh(db_edition)
    return db_edition

def get_book_edition(db: Session, edition_id: int):
    return db.query(BookEdition).filter(BookEdition.id == edition_id).first()

def get_book_editions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(BookEdition).offset(skip).limit(limit).all()

def search_books(db: Session, query: str, limit: int = 10):
    search_term = f"%{query}%"

    return (
        db.query(BookEdition)
        .join(LiteratureWork)
        .filter(
            or_(
                LiteratureWork.title.ilike(search_term),
                LiteratureWork.author.ilike(search_term)
            )
        )
        .limit(limit)
        .all()
    )