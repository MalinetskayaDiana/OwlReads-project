from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_reading_records import UserReadingRecord, UserReadingRecordCreate
from app.crud import users_reading_records as crud

router = APIRouter()

@router.post("/", response_model=UserReadingRecord, status_code=201)
def create_record(record: UserReadingRecordCreate, db: Session = Depends(get_db)):
    return crud.create_record(db, record)

@router.get("/", response_model=List[UserReadingRecord])
def read_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_records(db, skip=skip, limit=limit)

@router.get("/{record_id}/", response_model=UserReadingRecord)
def read_record(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record
