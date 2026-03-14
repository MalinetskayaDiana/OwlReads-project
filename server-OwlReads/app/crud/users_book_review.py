# app/crud/users_book_review.py
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
from app.models.users_book_review import UserBookReview
from app.schemas.users_book_review import UserBookReviewCreate
from app.models.literature_works import LiteratureWork
from app.models.books_editions import BookEdition
from app.models.books_categories import BookCategory
from app.schemas.custom_book import BookManualCreate
from app.models.genre import Genre
from app.models.users_book_review_genres import UserBookReviewGenre
from app.models.emotions import Emotion
from app.models.users_book_review_emotions import UserBookReviewEmotion

def create_review(db: Session, review: UserBookReviewCreate) -> UserBookReview:
    db_review = UserBookReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(UserBookReview)
        .options(
            joinedload(UserBookReview.category),
            joinedload(UserBookReview.rating),
            joinedload(UserBookReview.user),
            joinedload(UserBookReview.quotes),
            joinedload(UserBookReview.notes)
            # Добавь joinedload для всех полей, которые нужны в ответе
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
def get_review_by_id(db: Session, review_id: int):
    return db.query(UserBookReview).filter(UserBookReview.id == review_id).first()

def get_user_reviews_by_category_name(db: Session, user_id: int, category_name: str):
    return (
        db.query(UserBookReview)
        .join(UserBookReview.category)
        .filter(UserBookReview.user_id == user_id)
        .filter(UserBookReview.category.has(name=category_name))
        .all()
    )

def delete_review(db: Session, review_id: int) -> bool:
    obj = db.query(UserBookReview).filter(UserBookReview.id == review_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def get_user_library(db: Session, user_id: int, skip: int = 0, limit: int = 100, search_query: str = None):
    query = (
        db.query(UserBookReview)
        .join(BookEdition, UserBookReview.book_id == BookEdition.id)
        .join(LiteratureWork, BookEdition.literature_work_id == LiteratureWork.id)
        .options(
            joinedload(UserBookReview.book).joinedload(BookEdition.work),
            joinedload(UserBookReview.category),
            joinedload(UserBookReview.rating)
        )
        .filter(UserBookReview.user_id == user_id)
    )

    if search_query:
        search_term = f"%{search_query}%"
        query = query.filter(
            or_(
                LiteratureWork.title.ilike(search_term),
                LiteratureWork.author.ilike(search_term)
            )
        )

    return query.offset(skip).limit(limit).all()

def create_manual_book_review(db: Session, user_id: int, data: BookManualCreate):
    # 1. Ищем категорию
    category = db.query(BookCategory).filter(BookCategory.name == data.category_name).first()
    if not category:
        return None

    # 2. Создаем Литературное произведение
    new_work = LiteratureWork(
        title=data.title,
        author=data.author
    )
    db.add(new_work)
    db.flush()

    # 3. Создаем Издание книги
    new_edition = BookEdition(
        literature_work_id=new_work.id,
        pages=data.pages,
        year=data.year,
        language=data.language,
        description=data.description,
        cover_url=data.cover_url,
        isbn=data.isbn  # <--- ТЕПЕРЬ ISBN БУДЕТ СОХРАНЯТЬСЯ В БАЗУ
    )
    db.add(new_edition)
    db.flush()

    # 4. Создаем Отзыв пользователя
    new_review = UserBookReview(
        user_id=user_id,
        book_id=new_edition.id,
        category_id=category.id
    )
    db.add(new_review)

    db.commit()
    db.refresh(new_review)

    return new_review

def get_review_detail(db: Session, review_id: int):
    return (
        db.query(UserBookReview)
        .options(
            joinedload(UserBookReview.book).joinedload(BookEdition.work),
            joinedload(UserBookReview.category),
            joinedload(UserBookReview.rating),
            joinedload(UserBookReview.quotes),
            joinedload(UserBookReview.notes),
            joinedload(UserBookReview.genres).joinedload(UserBookReviewGenre.genre),
            joinedload(UserBookReview.emotions_links).joinedload(UserBookReviewEmotion.emotion)
        )
        .filter(UserBookReview.id == review_id)
        .first()
    )


def update_review_category(db: Session, review_id: int, category_name: str):
    # 1. Ищем сам отзыв
    review = db.query(UserBookReview).filter(UserBookReview.id == review_id).first()
    if not review:
        return None

    # 2. Ищем ID категории по названию (например "Читаю" -> id=2)
    category = db.query(BookCategory).filter(BookCategory.name == category_name).first()
    if not category:
        # Если такой категории нет в базе, ничего не делаем (или можно вернуть ошибку)
        return None

    # 3. Обновляем
    review.category_id = category.id
    db.commit()
    db.refresh(review)
    return review


def update_review_genres(db: Session, review_id: int, genre_names: list[str]):
    # 1. Удаляем ВСЕ текущие жанры у этого отзыва
    db.query(UserBookReviewGenre).filter(UserBookReviewGenre.review_id == review_id).delete()

    # 2. Если список пустой, просто сохраняем удаление
    if not genre_names:
        db.commit()
        return []

    # 3. Ищем ID жанров по их названиям
    # (SELECT * FROM genres WHERE name IN (...))
    genres = db.query(Genre).filter(Genre.name.in_(genre_names)).all()

    # 4. Создаем новые связи
    new_entries = []
    for genre in genres:
        entry = UserBookReviewGenre(review_id=review_id, genre_id=genre.id)
        db.add(entry)
        new_entries.append(entry)

    db.commit()

    # Возвращаем список объектов жанров (для удобства, если нужно)
    return genres

def update_review_emotions(db: Session, review_id: int, emotion_names: list[str]):
    # 1. Удаляем старые связи
    db.query(UserBookReviewEmotion).filter(UserBookReviewEmotion.review_id == review_id).delete()

    if not emotion_names:
        db.commit()
        return []

    # 2. Ищем объекты эмоций по названиям
    emotions = db.query(Emotion).filter(Emotion.name.in_(emotion_names)).all()

    # 3. Создаем новые связи
    for emo in emotions:
        db.add(UserBookReviewEmotion(review_id=review_id, emotion_id=emo.id))

    db.commit()
    return emotions