from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.books_categories import BookCategory, BookCategoryCreate
from app.crud import books_categories as crud

router = APIRouter()

@router.post("/", response_model=BookCategory, status_code=201)
def create_category(category: BookCategoryCreate, db: Session = Depends(get_db)):
    db_category = crud.get_category_by_name(db, category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists")
    return crud.create_category(db, category)

@router.get("/", response_model=List[BookCategory])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)
