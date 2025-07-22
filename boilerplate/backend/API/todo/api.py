from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from db.session import get_db
from . import crud, schemas

router = APIRouter()

@router.post("/", response_model=schemas.TodoRead)
def create(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(todo, db)

@router.get("/", response_model=list[schemas.TodoRead])
def read_all(db: Session = Depends(get_db)):
    return crud.get_all_todos(db)

@router.delete("/{todo_id}")
def delete(todo_id: int, db: Session = Depends(get_db)):
    success = crud.delete_todo(todo_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"ok": True}

@router.patch("/{todo_id}", response_model=schemas.TodoRead)
def update(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    updated_todo = crud.update_todo(todo_id, todo, db)
    if not updated_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated_todo
