from sqlalchemy.orm import Session
from app.models.users_book_quotes import UserBookQuote
from app.schemas.users_book_quotes import UserBookQuoteCreate

def create_quote(db: Session, quote: UserBookQuoteCreate):
    db_quote = UserBookQuote(**quote.dict())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

def get_quotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserBookQuote).offset(skip).limit(limit).all()

def get_quote(db: Session, quote_id: int):
    return db.query(UserBookQuote).filter(UserBookQuote.id == quote_id).first()

def delete_quote(db: Session, quote_id: int):
    obj = db.query(UserBookQuote).filter(UserBookQuote.id == quote_id).first()
    if obj:
        db.delete(obj)
        db.commit()
        return True
    return False