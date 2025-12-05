from fastapi import FastAPI
from app.api import popular_quotes
from app.api import genre
from app.api import literature
from app.api import users_book_notes
from app.api import users_book_quotes
from app.api import users_reading_records
from app.api import users_book_rating
from app.api import users_top_characters
from app.api import users_challenge_books_alphabet
from app.api import users_challenge_book_of_year
from app.api import users_challenges
from app.api import users_statistics
from app.api import users_personal_data
from app.api import users_book_review_genres
from app.api import books_categories

app = FastAPI(title="OwlReads API")

app.include_router(popular_quotes.router, prefix="/api", tags=["quotes"])
app.include_router(genre.router, prefix="/api")
app.include_router(literature.router, prefix="/literature", tags=["literature"])
app.include_router(users_book_notes.router, prefix="/users_book_notes", tags=["users_book_notes"])
app.include_router(users_book_quotes.router, prefix="/users_book_quotes", tags=["users_book_quotes"])
app.include_router(users_reading_records.router, prefix="/users_reading_records", tags=["users_reading_records"])
app.include_router(users_book_rating.router, prefix="/users_book_rating", tags=["users_book_rating"])
app.include_router(users_top_characters.router, prefix="/users_top_characters", tags=["users_top_characters"])
app.include_router(users_challenge_books_alphabet.router, prefix="/users_challenge_books_alphabet", tags=["users_challenge_books_alphabet"])
app.include_router(users_challenge_book_of_year.router, prefix="/users_challenge_book_of_year", tags=["users_challenge_book_of_year"])
app.include_router(users_challenges.router, prefix="/users_challenges", tags=["users_challenges"])
app.include_router(users_statistics.router, prefix="/users_statistics", tags=["users_statistics"])
app.include_router(users_personal_data.router, prefix="/users_personal_data", tags=["users_personal_data"])
app.include_router(users_book_review_genres.router, prefix="/users_book_review_genres", tags=["users_book_review_genres"])
app.include_router(books_categories.router, prefix="/books_categories", tags=["books_categories"])
