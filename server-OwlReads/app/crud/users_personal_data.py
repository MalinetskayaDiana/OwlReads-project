from sqlalchemy.orm import Session
from app.models.users_personal_data import UserPersonalData
from app.schemas.users_personal_data import UserPersonalDataCreate
from passlib.context import CryptContext
from app.utils.email import generate_verification_code, send_verification_email

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

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserPersonalData).offset(skip).limit(limit).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(UserPersonalData).filter(UserPersonalData.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(UserPersonalData).filter(UserPersonalData.email == email).first()