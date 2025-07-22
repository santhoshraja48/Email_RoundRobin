from sqlmodel import create_engine, Session
import os

DATABASE_URL = os.environ["DATABASE_URL"]  # Will raise error if not set

engine = create_engine(DATABASE_URL, echo=True)

def get_db():
    with Session(engine) as session:
        yield session
