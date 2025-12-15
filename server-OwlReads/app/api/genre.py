from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db   # <-- теперь импортируем отсюда
from app.models.genre import Genre as GenreModel
from app.schemas.genre import GenreRead

router = APIRouter()

@router.get("/", response_model=list[GenreRead])
def list_genres(db: Session = Depends(get_db)):
    return db.query(GenreModel).order_by(GenreModel.id).all()

@router.get("/{genre_id}/", response_model=GenreRead)
def get_genre(genre_id: int, db: Session = Depends(get_db)):
    genre = db.query(GenreModel).get(genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre
