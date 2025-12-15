from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_rating import UserBookRating, UserBookRatingCreate
from app.crud import users_book_rating as crud

router = APIRouter()

@router.post("/", response_model=UserBookRating, status_code=201)
def create_rating(rating: UserBookRatingCreate, db: Session = Depends(get_db)):
    return crud.create_rating(db, rating)

@router.get("/", response_model=List[UserBookRating])
def read_ratings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ratings(db, skip=skip, limit=limit)

@router.get("/{rating_id}/", response_model=UserBookRating)
def read_rating(rating_id: int, db: Session = Depends(get_db)):
    rating = crud.get_rating(db, rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating
