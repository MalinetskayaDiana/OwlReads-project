from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_personal_data import UserPersonalData, UserPersonalDataCreate, UserVerifyEmail
from app.crud import users_personal_data as crud

router = APIRouter()


@router.post("/", response_model=UserPersonalData, status_code=201)
def create_user(user: UserPersonalDataCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        # Если пользователь есть, но не подтвержден - можно пересоздать код (опционально)
        # Но пока просто вернем ошибку
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@router.post("/verify", status_code=200)
def verify_email(data: UserVerifyEmail, db: Session = Depends(get_db)):
    result = crud.verify_user_email(db, data.email, data.code)

    if result is None:
        raise HTTPException(status_code=404, detail="User not found")

    if result is False:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    return {"message": "Email verified successfully"}

@router.get("/", response_model=List[UserPersonalData])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}/", response_model=UserPersonalData)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user