from sqlalchemy.orm import Session
from app.models.users_book_notes import UserBookNote
from app.schemas.users_book_notes import UserBookNoteCreate

def create_note(db: Session, note: UserBookNoteCreate):
    db_note = UserBookNote(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserBookNote).offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int):
    return db.query(UserBookNote).filter(UserBookNote.id == note_id).first()
