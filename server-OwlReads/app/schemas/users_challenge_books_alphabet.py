from pydantic import BaseModel

class UserChallengeBooksAlphabetBase(BaseModel):
    letter: str

class UserChallengeBooksAlphabetCreate(UserChallengeBooksAlphabetBase):
    pass

class UserChallengeBooksAlphabet(UserChallengeBooksAlphabetBase):
    id: int

    class Config:
        orm_mode = True
