from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.literature import LiteratureWork, LiteratureWorkCreate, BookEdition, BookEditionCreate
from app.crud import literature as crud
from app.db.session import get_db

router = APIRouter()

# --- LiteratureWork ---
@router.post("/works/", response_model=LiteratureWork)
def create_work(work: LiteratureWorkCreate, db: Session = Depends(get_db)):
    return crud.create_literature_work(db, work)

@router.get("/works/", response_model=List[LiteratureWork])
def read_works(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_literature_works(db, skip=skip, limit=limit)

@router.get("/works/{work_id}", response_model=LiteratureWork)
def read_work(work_id: int, db: Session = Depends(get_db)):
    return crud.get_literature_work(db, work_id)


# --- BookEdition ---
@router.post("/editions/", response_model=BookEdition)
def create_edition(edition: BookEditionCreate, db: Session = Depends(get_db)):
    return crud.create_book_edition(db, edition)

@router.get("/editions/", response_model=List[BookEdition])
def read_editions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_book_editions(db, skip=skip, limit=limit)

@router.get("/editions/{edition_id}", response_model=BookEdition)
def read_edition(edition_id: int, db: Session = Depends(get_db)):
    return crud.get_book_edition(db, edition_id)
