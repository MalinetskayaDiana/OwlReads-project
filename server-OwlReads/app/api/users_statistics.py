from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_statistics import UserStatistics, UserStatisticsCreate
from app.crud import users_statistics as crud

router = APIRouter()

@router.post("/", response_model=UserStatistics, status_code=201)
def create_statistics(stats: UserStatisticsCreate, db: Session = Depends(get_db)):
    return crud.create_statistics(db, stats)

@router.get("/", response_model=List[UserStatistics])
def read_statistics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_statistics(db, skip=skip, limit=limit)

@router.get("/{stats_id}/", response_model=UserStatistics)
def read_statistics_by_id(stats_id: int, db: Session = Depends(get_db)):
    stats = crud.get_statistics_by_id(db, stats_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Statistics not found")
    return stats

@router.get("/user/{user_id}", response_model=UserStatistics)
def read_user_statistics(user_id: int, db: Session = Depends(get_db)):
    stats = crud.get_statistics_by_user_id(db, user_id)
    if not stats:
        # Если статистики нет, возвращаем пустую (нулевую) структуру, чтобы фронт не падал
        return UserStatistics(
            id=0, user_id=user_id,
            books_in_library=0, books_read=0, books_favorites=0,
            favorite_author="-", favorite_genre="-"
        )
    return stats
