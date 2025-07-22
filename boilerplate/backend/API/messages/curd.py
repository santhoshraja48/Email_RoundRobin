from sqlmodel import Session, select
from .models import Message
from .schemas import MessageCreate

def create_message(db: Session, message: MessageCreate) -> Message:
    db_message = Message(content=message.content)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages(db: Session):
    return db.exec(select(Message).order_by(Message.timestamp)).all()
