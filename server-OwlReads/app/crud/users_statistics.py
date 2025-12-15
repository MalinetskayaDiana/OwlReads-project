from sqlalchemy.orm import Session
from app.models.users_statistics import UserStatistics
from app.schemas.users_statistics import UserStatisticsCreate

def create_statistics(db: Session, stats: UserStatisticsCreate):
    db_stats = UserStatistics(**stats.dict())
    db.add(db_stats)
    db.commit()
    db.refresh(db_stats)
    return db_stats

def get_statistics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserStatistics).offset(skip).limit(limit).all()

def get_statistics_by_id(db: Session, stats_id: int):
    return db.query(UserStatistics).filter(UserStatistics.id == stats_id).first()

def get_statistics_by_user_id(db: Session, user_id: int):
    return db.query(UserStatistics).filter(UserStatistics.user_id == user_id).first()