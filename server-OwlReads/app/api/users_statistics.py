from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_statistics import UserStatistics, UserStatisticsCreate
from app.crud import users_statistics as crud

router = APIRouter()

@router.post("/statistics/", response_model=UserStatistics, status_code=201)
def create_statistics(stats: UserStatisticsCreate, db: Session = Depends(get_db)):
    return crud.create_statistics(db, stats)

@router.get("/statistics/", response_model=List[UserStatistics])
def read_statistics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_statistics(db, skip=skip, limit=limit)

@router.get("/statistics/{stats_id}/", response_model=UserStatistics)
def read_statistics_by_id(stats_id: int, db: Session = Depends(get_db)):
    stats = crud.get_statistics_by_id(db, stats_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Statistics not found")
    return stats
