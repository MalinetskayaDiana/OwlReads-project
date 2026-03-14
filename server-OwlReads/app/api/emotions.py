from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.emotions import Emotion
from app.schemas.emotions import EmotionRead
from typing import List

router = APIRouter()

@router.get("/", response_model=List[EmotionRead])
def list_emotions(db: Session = Depends(get_db)):
    return db.query(Emotion).order_by(Emotion.name).all()