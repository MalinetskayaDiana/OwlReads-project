from sqlalchemy.orm import Session
from app.models.literature_works import LiteratureWork
from app.models.books_editions import BookEdition
from app.schemas.literature import LiteratureWorkCreate, BookEditionCreate

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
