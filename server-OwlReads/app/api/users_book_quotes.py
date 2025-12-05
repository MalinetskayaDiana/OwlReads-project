from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_quotes import UserBookQuote, UserBookQuoteCreate
from app.crud import users_book_quotes as crud

router = APIRouter()

@router.post("/quotes/", response_model=UserBookQuote, status_code=201)
def create_quote(quote: UserBookQuoteCreate, db: Session = Depends(get_db)):
    return crud.create_quote(db, quote)

@router.get("/quotes/", response_model=List[UserBookQuote])
def read_quotes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_quotes(db, skip=skip, limit=limit)

@router.get("/quotes/{quote_id}/", response_model=UserBookQuote)
def read_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = crud.get_quote(db, quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote
