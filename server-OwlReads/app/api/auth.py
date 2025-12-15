from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.db.session import get_db
from app.crud import users_personal_data as crud
from app.core.security import verify_password, create_access_token

router = APIRouter()

class LoginSchema(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
def login(login_data: LoginSchema, db: Session = Depends(get_db)):
    # 1. Ищем пользователя по email
    user = crud.get_user_by_email(db, email=login_data.email)

    # 2. Если пользователя нет ИЛИ пароль не подходит
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Если всё ок, создаем токен
    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }