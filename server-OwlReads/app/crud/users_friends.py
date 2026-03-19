from sqlalchemy.orm import Session, joinedload
from app.models.users_friends import UserFriend
from app.models.users_personal_data import UserPersonalData


def add_friend(db: Session, user_id: int, friend_uid: str):
    friend = db.query(UserPersonalData).filter(UserPersonalData.uid == friend_uid).first()
    if not friend: return None, "User not found"
    if friend.id == user_id: return None, "You cannot add yourself"

    exists = db.query(UserFriend).filter(
        UserFriend.user_id == user_id,
        UserFriend.friend_id == friend.id
    ).first()

    if exists: return None, "Already requested or friends"

    # Статус 'pending' - ожидание подтверждения
    new_friendship = UserFriend(
        user_id=user_id,
        friend_id=friend.id,
        custom_nickname=friend.username,
        status="pending"
    )
    db.add(new_friendship)
    db.commit()
    db.refresh(new_friendship)
    return new_friendship, None


def get_incoming_requests(db: Session, user_id: int):
    # Ищем записи, где текущий юзер является friend_id и статус pending
    return db.query(UserFriend).options(joinedload(UserFriend.user)).filter(
        UserFriend.friend_id == user_id,
        UserFriend.status == "pending"
    ).all()

def respond_to_request(db: Session, friendship_id: int, user_id: int, accept: bool):
    friendship = db.query(UserFriend).filter(
        UserFriend.id == friendship_id,
        UserFriend.friend_id == user_id
    ).first()

    if friendship:
        if accept:
            friendship.status = "accepted"
            # Опционально: создаем обратную запись, чтобы дружба была взаимной сразу
            reverse = UserFriend(
                user_id=friendship.friend_id,
                friend_id=friendship.user_id,
                custom_nickname=friendship.user.username,
                status="accepted"
            )
            db.add(reverse)
        else:
            db.delete(friendship)
        db.commit()
        return True
    return False

def get_user_friends(db: Session, user_id: int):
    return db.query(UserFriend).filter(UserFriend.user_id == user_id).all()


def update_friend_nickname(db: Session, friendship_id: int, user_id: int, new_nickname: str):
    friendship = db.query(UserFriend).filter(
        UserFriend.id == friendship_id,
        UserFriend.user_id == user_id
    ).first()

    if friendship:
        friendship.custom_nickname = new_nickname
        db.commit()
        db.refresh(friendship)
    return friendship


def remove_friend(db: Session, friendship_id: int, user_id: int):
    friendship = db.query(UserFriend).filter(
        UserFriend.id == friendship_id,
        UserFriend.user_id == user_id
    ).first()
    if friendship:
        db.delete(friendship)
        db.commit()
        return True
    return False