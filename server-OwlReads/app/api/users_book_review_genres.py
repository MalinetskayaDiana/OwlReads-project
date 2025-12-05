from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_review_genres import UserBookReviewGenre, UserBookReviewGenreCreate
from app.crud import users_book_review_genres as crud

router = APIRouter()

@router.post("/review_genres/", response_model=UserBookReviewGenre, status_code=201)
def create_review_genre(entry: UserBookReviewGenreCreate, db: Session = Depends(get_db)):
    return crud.create_review_genre(db, entry)

@router.get("/review_genres/", response_model=List[UserBookReviewGenre])
def read_review_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_review_genres(db, skip=skip, limit=limit)

@router.get("/review_genres/{entry_id}/", response_model=UserBookReviewGenre)
def read_review_genre(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.get_review_genre(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="ReviewGenre entry not found")
    return entry
