from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.crud import users_friends as crud
from app.schemas.users_friends import FriendAdd, FriendRead, FriendUpdateNickname

router = APIRouter()


@router.post("/add/{user_id}", response_model=FriendRead)
def add_friend(user_id: int, data: FriendAdd, db: Session = Depends(get_db)):
    friendship, error = crud.add_friend(db, user_id, data.friend_uid)
    if error:
        raise HTTPException(status_code=400, detail=error)

    return FriendRead(
        id=friendship.id,
        friend_id=friendship.friend.id,
        friend_username=friendship.friend.username,
        custom_nickname=friendship.custom_nickname,
        friend_uid=friendship.friend.uid,
        friend_photo=friendship.friend.profile_photo
    )

# app/api/users_friends.py
@router.get("/pending/{user_id}")
def check_pending(user_id: int, db: Session = Depends(get_db)):
    requests = crud.get_incoming_requests(db, user_id)
    return [
        {
            "friendship_id": r.id,
            "user_id": r.user.id,
            "username": r.user.username,
            "profile_photo": r.user.profile_photo,
            "uid": r.user.uid
        } for r in requests
    ]

@router.post("/respond/{friendship_id}")
def respond(friendship_id: int, user_id: int, accept: bool, db: Session = Depends(get_db)):
    success = crud.respond_to_request(db, friendship_id, user_id, accept)
    if not success:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Success"}

@router.get("/my/{user_id}", response_model=List[FriendRead])
def list_friends(user_id: int, db: Session = Depends(get_db)):
    friends = crud.get_user_friends(db, user_id)
    return [
        FriendRead(
            id=f.id,
            friend_id=f.friend.id,
            friend_username=f.friend.username,
            custom_nickname=f.custom_nickname,
            friend_uid=f.friend.uid,
            friend_photo=f.friend.profile_photo
        ) for f in friends
    ]


@router.patch("/{friendship_id}/rename/{user_id}")
def rename_friend(friendship_id: int, user_id: int, data: FriendUpdateNickname, db: Session = Depends(get_db)):
    updated = crud.update_friend_nickname(db, friendship_id, user_id, data.custom_nickname)
    if not updated:
        raise HTTPException(status_code=404, detail="Friendship not found")
    return {"message": "Nickname updated", "new_nickname": updated.custom_nickname}


@router.delete("/{friendship_id}/remove/{user_id}")
def delete_friend(friendship_id: int, user_id: int, db: Session = Depends(get_db)):
    if not crud.remove_friend(db, friendship_id, user_id):
        raise HTTPException(status_code=404, detail="Friendship not found")
    return {"message": "Friend removed"}