from sqlalchemy.orm import Session
from app.models.users_personal_data import UserPersonalData
from app.schemas.users_personal_data import UserPersonalDataCreate
from app.schemas.users_personal_data import UserPersonalDataUpdate
from passlib.context import CryptContext
from app.utils.email import generate_verification_code, send_verification_email
from app.core.security import verify_password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, user: UserPersonalDataCreate):
    hashed_password = pwd_context.hash(user.password_hash)

    code = generate_verification_code()

    db_user = UserPersonalData(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        agreement_accepted=user.agreement_accepted,
        profile_photo=user.profile_photo,
        verification_code=code,
        is_verified=False
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    send_verification_email(user.email, code)

    return db_user

def verify_user_email(db: Session, email: str, code: str):
    user = get_user_by_email(db, email)
    if not user:
        return None

    if user.verification_code == code:
        user.is_verified = True
        user.verification_code = None
        db.commit()
        db.refresh(user)
        return user

    return False


# app/crud/users_personal_data.py

def update_user(db: Session, user_id: int, obj_in: UserPersonalDataUpdate):
    db_user = db.query(UserPersonalData).filter(UserPersonalData.id == user_id).first()
    if not db_user:
        return None

    update_data = obj_in.dict(exclude_unset=True)

    # Если пользователь пытается сменить пароль
    if "password" in update_data:
        # 1. Проверяем, прислал ли он старый пароль
        old_pwd = update_data.get("old_password")
        if not old_pwd or not verify_password(old_pwd, db_user.password_hash):
            # Если старый пароль неверный или не прислан, выбрасываем ошибку
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Incorrect old password")

        # 2. Если проверка прошла, хешируем новый
        db_user.password_hash = pwd_context.hash(update_data["password"])
        # Удаляем пароли из словаря, чтобы цикл ниже не пытался их записать в базу напрямую
        del update_data["password"]
        if "old_password" in update_data:
            del update_data["old_password"]

    # Обновляем остальные поля (username, email и т.д.)
    for field in update_data:
        setattr(db_user, field, update_data[field])

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

def delete_user(db: Session, user_id: int):
    db_user = db.query(UserPersonalData).filter(UserPersonalData.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False