from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_challenge_book_of_year import UserChallengeBookOfYear, UserChallengeBookOfYearCreate
from app.crud import users_challenge_book_of_year as crud

router = APIRouter()

@router.post("/book_of_year/", response_model=UserChallengeBookOfYear, status_code=201)
def create_entry(entry: UserChallengeBookOfYearCreate, db: Session = Depends(get_db)):
    return crud.create_entry(db, entry)

@router.get("/book_of_year/", response_model=List[UserChallengeBookOfYear])
def read_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_entries(db, skip=skip, limit=limit)

@router.get("/book_of_year/{entry_id}/", response_model=UserChallengeBookOfYear)
def read_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.get_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Book of Year entry not found")
    return entry
