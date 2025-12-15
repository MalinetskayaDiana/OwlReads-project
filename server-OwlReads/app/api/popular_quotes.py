from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func  # <--- Импортируем func для SQL функций

from app.db.session import get_db
from app.models.popular_quotes import PopularQuote as PopularQuoteModel
from app.schemas.popular_quotes import PopularQuoteCreate, PopularQuote as PopularQuoteSchema

router = APIRouter()


@router.post("/", response_model=PopularQuoteSchema, status_code=201)
def create_quote(quote: PopularQuoteCreate, db: Session = Depends(get_db)):
    db_quote = PopularQuoteModel(**quote.dict())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote


@router.get("/", response_model=list[PopularQuoteSchema])
def get_quotes(db: Session = Depends(get_db)):
    return db.query(PopularQuoteModel).all()


@router.get("/{quote_id}/", response_model=PopularQuoteSchema)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    quote = db.query(PopularQuoteModel).get(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote

@router.get("/random", response_model=PopularQuoteSchema)
def get_random_quote(db: Session = Depends(get_db)):
    quote = db.query(PopularQuoteModel).order_by(func.random()).first()

    if not quote:
        raise HTTPException(status_code=404, detail="No quotes found in database")

    return quote