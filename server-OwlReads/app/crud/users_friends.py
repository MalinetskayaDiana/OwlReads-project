from sqlalchemy.orm import Session
from app.models.users_friends import UserFriend
from app.models.users_personal_data import UserPersonalData


def add_friend(db: Session, user_id: int, friend_uid: str):
    # 1. Ищем друга по UID
    friend = db.query(UserPersonalData).filter(UserPersonalData.uid == friend_uid).first()
    if not friend:
        return None, "User not found"

    if friend.id == user_id:
        return None, "You cannot add yourself"

    # 2. Проверяем, не в друзьях ли он уже
    exists = db.query(UserFriend).filter(
        UserFriend.user_id == user_id,
        UserFriend.friend_id == friend.id
    ).first()

    if exists:
        return None, "Already in friends"

    # 3. Создаем запись. Изначально custom_nickname = реальный ник друга
    new_friendship = UserFriend(
        user_id=user_id,
        friend_id=friend.id,
        custom_nickname=friend.username
    )
    db.add(new_friendship)
    db.commit()
    db.refresh(new_friendship)
    return new_friendship, None


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