from sqlmodel import Session, select
from db.session import engine
from API.appinfo.models import AppVersion  # Adjust to your file

def insert_default_app_version():
    with Session(engine) as session:
        if not session.exec(select(AppVersion)).first():
            row = AppVersion(app="my_app", version="1.0.0")
            session.add(row)
            session.commit()
