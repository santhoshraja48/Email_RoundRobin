from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter
from backend.email_scheduler.send import email_logs, send_plan

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

@router.get("/api/logs")
def get_logs():
    return email_logs

# API endpoint to get total mails to send
@router.get("/api/total")
def get_total():
    return {"total": len(email_logs) + len(send_plan)}



