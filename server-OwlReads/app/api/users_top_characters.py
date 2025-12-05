from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_top_characters import UserTopCharacters, UserTopCharactersCreate
from app.crud import users_top_characters as crud

router = APIRouter()

@router.post("/top_characters/", response_model=UserTopCharacters, status_code=201)
def create_top_characters(top_chars: UserTopCharactersCreate, db: Session = Depends(get_db)):
    return crud.create_top_characters(db, top_chars)

@router.get("/top_characters/", response_model=List[UserTopCharacters])
def read_top_characters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_top_characters(db, skip=skip, limit=limit)

@router.get("/top_characters/{record_id}/", response_model=UserTopCharacters)
def read_top_characters_by_id(record_id: int, db: Session = Depends(get_db)):
    record = crud.get_top_characters_by_id(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Top characters record not found")
    return record
