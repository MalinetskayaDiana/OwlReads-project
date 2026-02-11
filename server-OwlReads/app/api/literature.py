from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.literature import LiteratureWork, LiteratureWorkCreate, BookEdition, BookEditionCreate
from app.crud import literature as crud
from app.db.session import get_db
from app.schemas.literature import BookSearchResponse

import requests

router = APIRouter()

# --- LiteratureWork ---
@router.post("/works", response_model=LiteratureWork)
def create_work(work: LiteratureWorkCreate, db: Session = Depends(get_db)):
    return crud.create_literature_work(db, work)

@router.get("/works", response_model=List[LiteratureWork])
def read_works(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_literature_works(db, skip=skip, limit=limit)

@router.get("/works/{work_id}", response_model=LiteratureWork)
def read_work(work_id: int, db: Session = Depends(get_db)):
    return crud.get_literature_work(db, work_id)

def get_from_open_library(isbn_code: str):
    """Вспомогательная функция для запроса к Open Library"""
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn_code}&format=json&jscmd=data"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        key = f"ISBN:{isbn_code}"

        if key not in data:
            return None

        book_info = data[key]
        return {
            "title": book_info.get("title", "Без названия"),
            "author": ", ".join([a.get("name") for a in book_info.get("authors", [])]) or "Неизвестный автор",
            "cover": book_info.get("cover", {}).get("large") or book_info.get("cover", {}).get("medium"),
            "pages": book_info.get("number_of_pages"),
            "year": int(book_info.get("publish_date")[-4:]) if book_info.get("publish_date") and len(
                book_info.get("publish_date")) >= 4 else None,
        }
    except:
        return None


@router.get("/isbn/{isbn_code}", response_model=BookSearchResponse)
def get_book_by_barcode(isbn_code: str, db: Session = Depends(get_db)):
    # 1. Поиск в локальной БД
    db_book = crud.get_book_by_isbn(db, isbn=isbn_code)
    if db_book:
        return BookSearchResponse(
            id=db_book.id,
            title=db_book.work.title,
            author=db_book.work.author,
            cover_url=db_book.cover_url,
            year=db_book.year,
            isbn=db_book.isbn,
            description=db_book.description,
            pages=db_book.pages,
            language=db_book.language,
            source="local"
        )

    # 2. Поиск в Open Library (Fallback 1)
    ol_data = get_from_open_library(isbn_code)
    if ol_data:
        return BookSearchResponse(
            id=0,
            title=ol_data["title"],
            author=ol_data["author"],
            cover_url=ol_data["cover"],
            year=ol_data["year"],
            isbn=isbn_code,
            pages=ol_data["pages"],
            source="open_library"
        )

    # 3. Поиск в Google Books (Fallback 2)
    google_url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn_code}"
    try:
        response = requests.get(google_url, timeout=5)
        data = response.json()
        if "items" in data:
            v_info = data["items"][0].get("volumeInfo", {})
            return BookSearchResponse(
                id=0,
                title=v_info.get("title", "Без названия"),
                author=", ".join(v_info.get("authors", ["Неизвестный автор"])),
                cover_url=v_info.get("imageLinks", {}).get("thumbnail", "").replace("http://", "https://"),
                year=int(v_info.get("publishedDate", "0000")[:4]) if v_info.get("publishedDate") else None,
                isbn=isbn_code,
                description=v_info.get("description", "Описание отсутствует"),
                pages=v_info.get("pageCount"),
                language=v_info.get("language"),
                source="google"
            )
    except:
        pass

    raise HTTPException(status_code=404, detail="Книга не найдена ни в одном источнике")

# --- BookEdition ---
@router.post("/editions", response_model=BookEdition)
def create_edition(edition: BookEditionCreate, db: Session = Depends(get_db)):
    return crud.create_book_edition(db, edition)

@router.get("/editions", response_model=List[BookEdition])
def read_editions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_book_editions(db, skip=skip, limit=limit)

@router.get("/editions/{edition_id}", response_model=BookEdition)
def read_edition(edition_id: int, db: Session = Depends(get_db)):
    return crud.get_book_edition(db, edition_id)

@router.get("/search", response_model=List[BookSearchResponse])
def search_books_endpoint(q: str, db: Session = Depends(get_db)):
    if not q:
        return []

    books = crud.search_books(db, query=q)

    # Преобразуем ORM модели в Pydantic схему вручную или автоматически
    results = []
    for book in books:
        results.append(BookSearchResponse(
            id=book.id,
            title=book.work.title,  # Берем название из связанной таблицы
            author=book.work.author,  # Берем автора из связанной таблицы
            cover_url=book.cover_url,
            year=book.year,
            source="local"
        ))
    return results