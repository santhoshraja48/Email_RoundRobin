from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from db.session import engine, get_db
from .models import Message
from .schemas import MessageCreate, MessageRead


router = APIRouter()

@router.post("/", response_model=MessageRead)
async def create_message(message_create: MessageCreate):
    message = Message(content=message_create.content)
    with Session(engine) as session:
        session.add(message)
        session.commit()
        session.refresh(message)
    return message

@router.get("/", response_model=list[MessageRead])
async def read_messages():
    with Session(engine) as session:
        messages = session.exec(select(Message)).all()
    return messages

@router.delete("/clear")
def clear_messages(db: Session = Depends(get_db)):
    db.query(Message).delete()
    db.commit()
    return {"message": "All messages cleared"}