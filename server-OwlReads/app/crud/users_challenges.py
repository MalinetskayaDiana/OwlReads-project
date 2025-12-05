from sqlalchemy.orm import Session
from app.models.users_challenges import UserChallenge
from app.schemas.users_challenges import UserChallengeCreate

def create_challenge(db: Session, challenge: UserChallengeCreate):
    db_challenge = UserChallenge(**challenge.dict())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

def get_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserChallenge).offset(skip).limit(limit).all()

def get_challenge(db: Session, challenge_id: int):
    return db.query(UserChallenge).filter(UserChallenge.id == challenge_id).first()
