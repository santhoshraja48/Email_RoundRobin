from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from API.todo.api import router as todo_router
from API.messages.api import router as messages_router
from db.session import engine
from API.todo.models import SQLModel
from startup import insert_default_app_version

app = FastAPI()

# Enable CORS for frontend - adjust origins if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    insert_default_app_version()


# Include routers
app.include_router(todo_router, prefix="/todos", tags=["todos"])
app.include_router(messages_router, prefix="/messages", tags=["messages"])
