from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from collections import Counter

from app.db.session import get_db
from app.schemas.users_statistics import UserStatistics
from app.models.users_book_review import UserBookReview
from app.models.books_editions import BookEdition
from app.models.literature_works import LiteratureWork
from app.models.users_book_review_genres import UserBookReviewGenre
from app.models.genre import Genre
from app.models.books_categories import BookCategory

router = APIRouter()


@router.get("/user/{user_id}", response_model=UserStatistics)
def read_user_statistics(user_id: int, db: Session = Depends(get_db)):
    # 1. Загружаем все отзывы пользователя вместе с книгами, авторами, категориями и жанрами
    reviews = (
        db.query(UserBookReview)
        .options(
            joinedload(UserBookReview.category),
            joinedload(UserBookReview.book).joinedload(BookEdition.work),
            joinedload(UserBookReview.genres).joinedload(UserBookReviewGenre.genre)
        )
        .filter(UserBookReview.user_id == user_id)
        .all()
    )

    # 2. Инициализируем счетчики
    total_books = 0
    read_count = 0
    favorites_count = 0

    authors_list = []
    genres_list = []

    # 3. Проходимся по всем книгам и считаем
    for review in reviews:
        total_books += 1

        cat_name = review.category.name if review.category else ""

        # Логика подсчета
        if cat_name == "Прочитано":
            read_count += 1
        elif cat_name == "Любимые":
            favorites_count += 1
            # Обычно любимые книги тоже считаются прочитанными
            read_count += 1

            # Собираем автора (если есть)
        if review.book and review.book.work:
            authors_list.append(review.book.work.author)

        # Собираем жанры
        if review.genres:
            for g_link in review.genres:
                if g_link.genre:
                    genres_list.append(g_link.genre.name)

    # 4. Определяем самого популярного автора
    favorite_author = "-"
    if authors_list:
        # Counter создает словарь {автор: кол-во}, most_common(1) берет топ-1
        favorite_author = Counter(authors_list).most_common(1)[0][0]

    # 5. Определяем самый популярный жанр
    favorite_genre = "-"
    if genres_list:
        favorite_genre = Counter(genres_list).most_common(1)[0][0]

    # 6. Возвращаем объект статистики
    # id=0, так как это вычисляемая "на лету" сущность, а не запись из таблицы users_statistics
    return UserStatistics(
        id=0,
        user_id=user_id,
        books_in_library=total_books,
        books_read=read_count,
        books_favorites=favorites_count,
        favorite_author=favorite_author,
        favorite_genre=favorite_genre
    )


# Остальные эндпоинты можно оставить или закомментировать,
# так как фронтенд использует только этот.
@router.post("/", response_model=UserStatistics, status_code=201)
def create_statistics(stats: UserStatistics, db: Session = Depends(get_db)):
    # Заглушка, чтобы не ломать старый код, если он где-то используется
    return stats


@router.get("/", response_model=List[UserStatistics])
def read_statistics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return []