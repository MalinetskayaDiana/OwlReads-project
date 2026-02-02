# app/api/users_book_review.py
import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.users_book_review import UserBookReview, UserBookReviewCreate, LibraryBookRead, BookReviewDetail, UserBookReviewUpdateCategory, UserBookReviewUpdateGenres
from app.crud import users_book_review as crud
from app.schemas.custom_book import BookManualCreate

# Настройка логгера для отладки ошибок 500
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/reviews", response_model=UserBookReview, status_code=201)
def create_review(review: UserBookReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, review)


@router.get("/reviews", response_model=List[UserBookReview])
def read_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reviews(db, skip=skip, limit=limit)


@router.get("/reviews/{review_id}/", response_model=UserBookReview)
def read_review(review_id: int, db: Session = Depends(get_db)):
    review = crud.get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.get("/users/{user_id}/reviews/by_category", response_model=List[UserBookReview])
def read_user_reviews_by_category(
        user_id: int,
        category_name: str = Query(..., description="Название категории, например: Прочитано"),
        db: Session = Depends(get_db),
):
    results = crud.get_user_reviews_by_category_name(db, user_id, category_name)
    return results

@router.patch("/reviews/{review_id}/category", response_model=UserBookReview)
def update_category(
    review_id: int,
    update_data: UserBookReviewUpdateCategory,
    db: Session = Depends(get_db)
):
    review = crud.update_review_category(db, review_id, update_data.category_name)
    if not review:
        raise HTTPException(status_code=404, detail="Review or Category not found")
    return review

@router.put("/reviews/{review_id}/genres")
def update_genres(
    review_id: int,
    update_data: UserBookReviewUpdateGenres,
    db: Session = Depends(get_db)
):
    crud.update_review_genres(db, review_id, update_data.genres)
    return {"message": "Genres updated successfully"}

@router.delete("/reviews/{review_id}/", status_code=204)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_review(db, review_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Review not found")
    return None


@router.post("/manual", status_code=201)
def add_book_manually(
        book_data: BookManualCreate,
        user_id: int = Query(..., description="ID пользователя"),
        db: Session = Depends(get_db)
):
    review = crud.create_manual_book_review(db, user_id, book_data)
    if not review:
        raise HTTPException(status_code=400, detail="Category not found or error creating book")

    return {"message": "Book added successfully", "review_id": review.id}


@router.get("/library/{user_id}", response_model=List[LibraryBookRead])
def read_user_library(user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reviews = crud.get_user_library(db, user_id, skip, limit)

    results = []
    for review in reviews:
        # Защита от ошибок, если вдруг данных нет
        book_title = review.book.work.title if review.book and review.book.work else "Без названия"
        book_author = review.book.work.author if review.book and review.book.work else "Неизвестный автор"
        cover = review.book.cover_url if review.book else None
        cat_name = review.category.name if review.category else "Без категории"
        cat_color = review.category.color if review.category else "#AB66FF"
        rating_val = review.rating.total_rating if review.rating else 0

        results.append(LibraryBookRead(
            review_id=review.id,
            book_id=review.book_id,
            title=book_title,
            author=book_author,
            cover_url=cover,
            category_name=cat_name,
            category_color=cat_color,
            rating=rating_val
        ))
    return results


@router.get("/{review_id}", response_model=BookReviewDetail)
def read_review_detail(review_id: int, db: Session = Depends(get_db)):
    try:
        review = crud.get_review_detail(db, review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")

        # Безопасное получение данных книги
        if not review.book:
            print(f"ERROR: Review {review_id} has no book associated!")
            raise HTTPException(status_code=500, detail="Data integrity error: Book missing")

        if not review.book.work:
            print(f"ERROR: Book {review.book.id} has no LiteratureWork associated!")
            # Можно вернуть заглушку или ошибку
            work_title = "Unknown Title"
            work_author = "Unknown Author"
        else:
            work_title = review.book.work.title
            work_author = review.book.work.author

        # Собираем жанры из связующей таблицы
        # Проверяем, что review.genres не None
        genres_list = []
        if review.genres:
            for g in review.genres:
                if g.genre:
                    genres_list.append(g.genre)

        return BookReviewDetail(
            review_id=review.id,
            book_id=review.book.id,
            title=work_title,
            author=work_author,
            pages=review.book.pages,
            year=review.book.year,
            description=review.book.description,
            cover_url=review.book.cover_url,
            category_name=review.category.name if review.category else "Без категории",
            rating=review.rating,  # Pydantic сам обработает None
            quotes=review.quotes if review.quotes else [],
            notes=review.notes if review.notes else [],
            genres=genres_list
        )
    except Exception as e:
        # Логируем ошибку в консоль сервера, чтобы видеть причину 500
        logger.error(f"Error fetching review detail {review_id}: {str(e)}", exc_info=True)
        # Пробрасываем ошибку дальше, чтобы фронт получил 500
        raise e