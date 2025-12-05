from pydantic import BaseModel

class UserTopCharactersBase(BaseModel):
    top_1: str | None = None
    top_2: str | None = None
    top_3: str | None = None
    top_4: str | None = None
    top_5: str | None = None

class UserTopCharactersCreate(UserTopCharactersBase):
    pass

class UserTopCharacters(UserTopCharactersBase):
    id: int

    class Config:
        orm_mode = True
