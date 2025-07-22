from sqlmodel import Session
from db.session import engine
from API.messages.models import Message  # Adjust if your import path is different

def clear_all_messages():
    with Session(engine) as session:
        session.query(Message).delete()
        session.commit()
        print("✅ All messages cleared from the database.")

if __name__ == "__main__":
    clear_all_messages()
