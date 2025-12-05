from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db   # <-- теперь импортируем общий get_db
from app.models.popular_quotes import PopularQuote as PopularQuoteModel
from app.schemas.popular_quotes import PopularQuoteCreate, PopularQuote as PopularQuoteSchema

router = APIRouter()

@router.post("/quotes/", response_model=PopularQuoteSchema, status_code=201)
def create_quote(quote: PopularQuoteCreate, db: Session = Depends(get_db)):
    db_quote = PopularQuoteModel(**quote.dict())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@router.get("/quotes/", response_model=list[PopularQuoteSchema])
def get_quotes(db: Session = Depends(get_db)):
    return db.query(PopularQuoteModel).all()

@router.get("/quotes/{quote_id}/", response_model=PopularQuoteSchema)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(PopularQuoteModel).get(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote
