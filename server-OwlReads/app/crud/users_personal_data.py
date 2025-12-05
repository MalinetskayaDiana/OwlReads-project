from sqlalchemy.orm import Session
from app.models.users_personal_data import UserPersonalData
from app.schemas.users_personal_data import UserPersonalDataCreate

def create_user(db: Session, user: UserPersonalDataCreate):
    db_user = UserPersonalData(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserPersonalData).offset(skip).limit(limit).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(UserPersonalData).filter(UserPersonalData.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(UserPersonalData).filter(UserPersonalData.email == email).first()
