from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    content: str

class MessageRead(BaseModel):
    id: int
    content: str
    timestamp: datetime

    class Config:
        orm_mode = True
