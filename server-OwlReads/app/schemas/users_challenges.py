from pydantic import BaseModel
from datetime import datetime

class UserChallengeBase(BaseModel):
    challenge_type: str
    started_at: datetime | None = None
    finished_at: datetime | None = None
    status: str = "В процессе"

class UserChallengeCreate(UserChallengeBase):
    pass

class UserChallenge(UserChallengeBase):
    id: int

    class Config:
        orm_mode = True
