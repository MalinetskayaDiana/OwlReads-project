from sqlalchemy.orm import Session
from app.models.users_reading_records import UserReadingRecord
from app.schemas.users_reading_records import UserReadingRecordCreate

def create_record(db: Session, record: UserReadingRecordCreate):
    db_record = UserReadingRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserReadingRecord).offset(skip).limit(limit).all()

def get_record(db: Session, record_id: int):
    return db.query(UserReadingRecord).filter(UserReadingRecord.id == record_id).first()
