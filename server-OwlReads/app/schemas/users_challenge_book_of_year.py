from pydantic import BaseModel

class UserChallengeBookOfYearBase(BaseModel):
    month: int | None = None
    stage: str
    is_winner: bool = False

class UserChallengeBookOfYearCreate(UserChallengeBookOfYearBase):
    pass

class UserChallengeBookOfYear(UserChallengeBookOfYearBase):
    id: int

    class Config:
        orm_mode = True
