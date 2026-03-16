from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi import UploadFile, File, Form
import uuid
import shutil

from app.db.session import get_db
from app.schemas.users_personal_data import UserPersonalData, UserPersonalDataCreate, UserVerifyEmail, UserPersonalDataUpdate
from app.crud import users_personal_data as crud
from app.core.security import get_password_hash
from app.core.security import verify_password

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

# app/api/users_personal_data.py
from fastapi import UploadFile, File, Form # Проверь импорты

@router.patch("/{user_id}/", response_model=UserPersonalData)
async def update_user_data(
    user_id: int,
    username: str = Form(None),
    email: str = Form(None),
    old_password: str = Form(None),
    password: str = Form(None),
    profile_photo: str = Form(None), # Для названий пресетов (owl_icon_red и т.д.)
    profile_photo_file: UploadFile = File(None), # Для загрузки своего фото
    db: Session = Depends(get_db)
):
    # 1. Получаем пользователя
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Проверка пароля (если меняется)
    if password:
        if not old_password or not verify_password(old_password, db_user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect old password")
        db_user.password_hash = get_password_hash(password)

    # 3. Обработка фото
    if profile_photo_file:
        # Сохраняем файл
        file_extension = profile_photo_file.filename.split(".")[-1]
        file_name = f"avatar_{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_photo_file.file, buffer)
        db_user.profile_photo = f"/static/{file_name}"
    elif profile_photo:
        # Если пришло имя пресета
        db_user.profile_photo = profile_photo

    # 4. Обновляем остальные поля
    if username: db_user.username = username
    if email: db_user.email = email

    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/{user_id}/avatar")
async def update_avatar(
    user_id: int,
    preset_name: str = Form(None), # Для встроенных иконок
    file: UploadFile = File(None), # Для загрузки своего фото
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if file:
        # Сохраняем файл, как мы делали с обложками книг
        file_extension = file.filename.split(".")[-1]
        file_name = f"avatar_{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        user.profile_photo = f"/static/{file_name}"
    elif preset_name:
        # Если выбрана встроенная иконка, просто сохраняем её имя
        user.profile_photo = preset_name

    db.commit()
    db.refresh(user)
    return {"profile_photo": user.profile_photo}

@router.get("/", response_model=List[UserPersonalData])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}/", response_model=UserPersonalData)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}/", status_code=204)
def delete_user_account(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return None