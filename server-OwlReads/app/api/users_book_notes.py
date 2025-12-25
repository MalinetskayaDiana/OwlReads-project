from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_notes import UserBookNote, UserBookNoteCreate
from app.crud import users_book_notes as crud

router = APIRouter()

@router.post("/", response_model=UserBookNote, status_code=201)
def create_note(note: UserBookNoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db, note)

@router.get("/", response_model=List[UserBookNote])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_notes(db, skip=skip, limit=limit)

@router.get("/{note_id}/", response_model=UserBookNote)
def read_note(note_id: int, db: Session = Depends(get_db)):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}/", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    success = crud.delete_note(db, note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")
    return None