from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_challenge_books_alphabet import UserChallengeBooksAlphabet, UserChallengeBooksAlphabetCreate
from app.crud import users_challenge_books_alphabet as crud

router = APIRouter()

@router.post("/alphabet", response_model=UserChallengeBooksAlphabet, status_code=201)
def create_alphabet_entry(entry: UserChallengeBooksAlphabetCreate, db: Session = Depends(get_db)):
    return crud.create_alphabet_entry(db, entry)

@router.get("/alphabet", response_model=List[UserChallengeBooksAlphabet])
def read_alphabet_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_alphabet_entries(db, skip=skip, limit=limit)

@router.get("/alphabet/{entry_id}/", response_model=UserChallengeBooksAlphabet)
def read_alphabet_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.get_alphabet_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Alphabet entry not found")
    return entry
