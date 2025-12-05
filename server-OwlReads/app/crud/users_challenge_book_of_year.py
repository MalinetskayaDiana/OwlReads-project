from sqlalchemy.orm import Session
from app.models.users_challenge_book_of_year import UserChallengeBookOfYear
from app.schemas.users_challenge_book_of_year import UserChallengeBookOfYearCreate

def create_entry(db: Session, entry: UserChallengeBookOfYearCreate):
    db_entry = UserChallengeBookOfYear(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserChallengeBookOfYear).offset(skip).limit(limit).all()

def get_entry(db: Session, entry_id: int):
    return db.query(UserChallengeBookOfYear).filter(UserChallengeBookOfYear.id == entry_id).first()
