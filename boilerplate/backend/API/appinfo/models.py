from sqlmodel import SQLModel, Field
from typing import Optional

class AppVersion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    app: str
    version: str
