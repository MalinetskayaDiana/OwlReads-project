from sqlalchemy.orm import Session
from app.models.users_top_characters import UserTopCharacters
from app.schemas.users_top_characters import UserTopCharactersCreate

def create_top_characters(db: Session, top_chars: UserTopCharactersCreate):
    db_top_chars = UserTopCharacters(**top_chars.dict())
    db.add(db_top_chars)
    db.commit()
    db.refresh(db_top_chars)
    return db_top_chars

def get_top_characters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserTopCharacters).offset(skip).limit(limit).all()

def get_top_characters_by_id(db: Session, record_id: int):
    return db.query(UserTopCharacters).filter(UserTopCharacters.id == record_id).first()
