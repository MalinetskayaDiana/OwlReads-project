# app/api/users_book_review.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_review import UserBookReview, UserBookReviewCreate
from app.crud import users_book_review as crud

router = APIRouter()

@router.post("/reviews/", response_model=UserBookReview, status_code=201)
def create_review(review: UserBookReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, review)

@router.get("/reviews/", response_model=List[UserBookReview])
def read_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reviews(db, skip=skip, limit=limit)

@router.get("/reviews/{review_id}/", response_model=UserBookReview)
def read_review(review_id: int, db: Session = Depends(get_db)):
    review = crud.get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.get("/users/{user_id}/reviews/by_category/", response_model=List[UserBookReview])
def read_user_reviews_by_category(
    user_id: int,
    category_name: str = Query(..., description="Название категории, например: Прочитано"),
    db: Session = Depends(get_db),
):
    results = crud.get_user_reviews_by_category_name(db, user_id, category_name)
    return results

@router.delete("/reviews/{review_id}/", status_code=204)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_review(db, review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Review not found")
    return None
