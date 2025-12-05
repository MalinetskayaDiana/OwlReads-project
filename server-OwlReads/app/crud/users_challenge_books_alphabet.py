from sqlalchemy.orm import Session
from app.models.users_challenge_books_alphabet import UserChallengeBooksAlphabet
from app.schemas.users_challenge_books_alphabet import UserChallengeBooksAlphabetCreate

def create_alphabet_entry(db: Session, entry: UserChallengeBooksAlphabetCreate):
    db_entry = UserChallengeBooksAlphabet(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_alphabet_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserChallengeBooksAlphabet).offset(skip).limit(limit).all()

def get_alphabet_entry(db: Session, entry_id: int):
    return db.query(UserChallengeBooksAlphabet).filter(UserChallengeBooksAlphabet.id == entry_id).first()
