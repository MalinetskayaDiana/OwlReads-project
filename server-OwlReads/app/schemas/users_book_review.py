from typing import List, Optional, TYPE_CHECKING
from pydantic import BaseModel

# Импортируем другие схемы (обратите внимание на точки перед названиями файлов)
from .books_categories import BookCategory
from .users_book_rating import UserBookRating
from .users_book_quotes import UserBookQuote
from .users_book_notes import UserBookNote
from .genre import GenreRead
from .emotions import EmotionRead

if TYPE_CHECKING:
    from .literature import BookEdition

class UserBookReviewBase(BaseModel):
    user_id: int
    book_id: int
    category_id: int

class UserBookReviewCreate(UserBookReviewBase):
    pass

class UserBookReview(UserBookReviewBase):
    id: int
    category: BookCategory
    book: Optional["BookEdition"] = None
    rating: Optional[UserBookRating] = None
    quotes: List[UserBookQuote] = []
    notes: List[UserBookNote] = []

    class Config:
        from_attributes = True

class LibraryBookRead(BaseModel):
    review_id: int
    book_id: int
    title: str
    author: str
    cover_url: Optional[str] = None
    category_name: str
    category_color: str = "#AB66FF"
    rating: int = 0

    class Config:
        from_attributes = True

class BookReviewDetail(BaseModel):
    review_id: int
    book_id: int

    # Данные книги
    title: str
    author: str
    pages: Optional[int] = None
    year: Optional[int] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    isbn: Optional[str] = None

    # Данные отзыва
    category_name: str
    category_color: str

    # Вложенные данные
    rating: Optional[UserBookRating] = None
    quotes: List[UserBookQuote] = []
    notes: List[UserBookNote] = []
    genres: List[GenreRead] = []
    emotions: List[EmotionRead] = []

    class Config:
        from_attributes = True

class UserBookReviewUpdateCategory(BaseModel):
    category_name: str

class UserBookReviewUpdateGenres(BaseModel):
    genres: List[str]  # Список названий, например ["Фэнтези", "Роман"]

class UserBookReviewUpdateEmotions(BaseModel):
    emotions: List[str]  # Список названий, например ["Смех", "Вдохновение"]

from .literature import BookEdition
UserBookReview.model_rebuild()