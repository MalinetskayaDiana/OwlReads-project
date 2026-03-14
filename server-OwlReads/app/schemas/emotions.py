from pydantic import BaseModel
from typing import Optional

class EmotionBase(BaseModel):
    name: str
    image_code: Optional[str] = None
    color: str

class EmotionRead(EmotionBase):
    id: int

    class Config:
        from_attributes = True