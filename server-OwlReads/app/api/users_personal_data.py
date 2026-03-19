from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import uuid
import shutil

from app.db.session import get_db
# 1. Импортируем схемы с алиасом UserSchema, чтобы не было конфликта
from app.schemas.users_personal_data import (
    UserPersonalData as UserSchema,
    UserPersonalDataCreate,
    UserVerifyEmail,
    UserPersonalDataUpdate
)
from app.crud import users_personal_data as crud
from app.core.security import get_password_hash, verify_password

# 2. Импортируем модели с алиасами
from app.models.users_personal_data import UserPersonalData as UserModel
from app.models.users_friends import UserFriend
from app.models.users_book_review import UserBookReview
from app.models.books_categories import BookCategory

router = APIRouter()


@router.post("/", response_model=UserSchema, status_code=201)
def create_user(user: UserPersonalDataCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
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


@router.patch("/{user_id}/", response_model=UserSchema)
async def update_user_data(
        user_id: int,
        username: str = Form(None),
        email: str = Form(None),
        old_password: str = Form(None),
        password: str = Form(None),
        profile_photo: str = Form(None),
        profile_photo_file: UploadFile = File(None),
        db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if password:
        if not old_password or not verify_password(old_password, db_user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect old password")
        db_user.password_hash = get_password_hash(password)

    if profile_photo_file:
        file_extension = profile_photo_file.filename.split(".")[-1]
        file_name = f"avatar_{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_photo_file.file, buffer)
        db_user.profile_photo = f"/static/{file_name}"
    elif profile_photo:
        db_user.profile_photo = profile_photo

    if username: db_user.username = username
    if email: db_user.email = email

    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/{user_id}/avatar")
async def update_avatar(
        user_id: int,
        preset_name: str = Form(None),
        file: UploadFile = File(None),
        db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if file:
        file_extension = file.filename.split(".")[-1]
        file_name = f"avatar_{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{file_name}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        user.profile_photo = f"/static/{file_name}"
    elif preset_name:
        user.profile_photo = preset_name

    db.commit()
    db.refresh(user)
    return {"profile_photo": user.profile_photo}


@router.get("/", response_model=List[UserSchema])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}/", response_model=UserSchema)
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


@router.get("/search/{uid}", response_model=UserSchema)
def search_user_by_uid(uid: str, db: Session = Depends(get_db)):
    # Используем UserModel
    user = db.query(UserModel).filter(UserModel.uid == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с таким ID не найден")
    return user


@router.get("/search-info/{uid}")
def search_friend_with_stats(uid: str, current_user_id: int, db: Session = Depends(get_db)):
    # 1. Ищем пользователя по UID
    user = db.query(UserModel).filter(UserModel.uid == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # 2. Считаем статистику напрямую (чтобы избежать циклического импорта из другого роутера)
    total_books = db.query(UserBookReview).filter(UserBookReview.user_id == user.id).count()

    read_books = db.query(UserBookReview).join(BookCategory).filter(
        UserBookReview.user_id == user.id,
        BookCategory.name == "Прочитано"
    ).count()

    fav_books = db.query(UserBookReview).join(BookCategory).filter(
        UserBookReview.user_id == user.id,
        BookCategory.name == "Любимые"
    ).count()

    # 3. Проверяем, не в друзьях ли он уже
    friendship = db.query(UserFriend).filter(
        UserFriend.user_id == current_user_id,
        UserFriend.friend_id == user.id
    ).first()

    return {
        "id": user.id,
        "username": user.username,
        "profile_photo": user.profile_photo,
        "uid": user.uid,
        "stats": {
            "total": total_books,
            "read": read_books + fav_books,
            "favorites": fav_books
        },
        "friendship_id": friendship.id if friendship else None,
        "is_friend": friendship is not None
    }