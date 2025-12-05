from fastapi import FastAPI
from app.db import engine, Base
# импортируем модели, чтобы они зарегистрировались в metadata
import app.models  # noqa: F401

app = FastAPI(title="OwlReads API")

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"status": "ok"}
