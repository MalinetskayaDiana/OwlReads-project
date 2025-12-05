from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_challenges import UserChallenge, UserChallengeCreate
from app.crud import users_challenges as crud

router = APIRouter()

@router.post("/challenges/", response_model=UserChallenge, status_code=201)
def create_challenge(challenge: UserChallengeCreate, db: Session = Depends(get_db)):
    return crud.create_challenge(db, challenge)

@router.get("/challenges/", response_model=List[UserChallenge])
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_challenges(db, skip=skip, limit=limit)

@router.get("/challenges/{challenge_id}/", response_model=UserChallenge)
def read_challenge(challenge_id: int, db: Session = Depends(get_db)):
    challenge = crud.get_challenge(db, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge
