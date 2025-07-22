import os
import json
import re
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from pymongo import MongoClient
import openai
import uvicorn
from bson import ObjectId

load_dotenv()

# Azure OpenAI setup
openai.api_type = "azure"
openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2024-02-01"
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")

# MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["sales_outreach"]
collection = db["simulated_send_log"]

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FullEmailInput(BaseModel):
    _id: str  # MongoDB ObjectId as string
    time: str
    sender: str
    recipient: str
    domain: str
    subject: str
    message: str

def safe_parse_json(raw: str):
    try:
        if raw.startswith("```json"):
            raw = raw.removeprefix("```json").removesuffix("```").strip()
        elif raw.startswith("```"):
            raw = raw.removeprefix("```").removesuffix("```").strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        try:
            match = re.search(r"\[\s*{.*}\s*]", raw, re.DOTALL)
            if match:
                return json.loads(match.group(0))
        except Exception:
            pass
    return None

def chunk_list(data, size):
    for i in range(0, len(data), size):
        yield data[i:i + size]

async def call_gpt(compact_pairs: List[dict]) -> str:
    prompt = (
        "You are given a list of email communication pairs. For each pair, generate a unique subject line and message. "
        "Both should be short, friendly, and business-appropriate. Format the result strictly as a JSON array with keys: sender, recipient, subject, and message. "
        "Do NOT include any explanation, markdown, or comments. Only the pure JSON array.\n\n"
        f"Input: {json.dumps(compact_pairs)}"
    )

    response = openai.ChatCompletion.create(
        engine=AZURE_OPENAI_DEPLOYMENT,
        messages=[
            {"role": "system", "content": "You are a professional email copy generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000,
    )

    gpt_output = response['choices'][0]['message']['content'].strip()
    print("🔵 GPT Output:\n", gpt_output)
    return gpt_output

@app.get("/fetch-emails")
async def fetch_emails():
    try:
        print("🔍 Connecting to MongoDB...")
        emails = list(collection.find({}, {}))  # ✅ include _id
        for email in emails:
            email["_id"] = str(email["_id"])  # make JSON serializable
        print(f"📦 Fetched {len(emails)} emails")
        return emails
    except Exception as e:
        print("❌ Error in /fetch-emails:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch emails from MongoDB")


@app.post("/generate-emails")
async def generate_emails():
    try:
        records = list(collection.find({}, {"_id": 1, "time": 1, "sender": 1, "recipient": 1, "domain": 1}))
        compact_pairs = [{"sender": r["sender"], "recipient": r["recipient"]} for r in records]

        enriched_output = []
        batch_size = 10  # ✅ adjust if needed

        for pair_chunk, full_chunk in zip(chunk_list(compact_pairs, batch_size), chunk_list(records, batch_size)):
            gpt_output = await call_gpt(pair_chunk)
            parsed = safe_parse_json(gpt_output)

            # Retry once if parsing fails
            if parsed is None:
                gpt_output = await call_gpt(pair_chunk)
                parsed = safe_parse_json(gpt_output)

            if parsed is None:
                raise HTTPException(status_code=500, detail="Failed to parse JSON from GPT response.")

            for original, gpt in zip(full_chunk, parsed):
                doc = {
                    "time": original["time"],
                    "sender": original["sender"],
                    "recipient": original["recipient"],
                    "domain": original["domain"],
                    "subject": gpt["subject"],
                    "message": gpt["message"],
                    "_id": str(original["_id"]),
                }
                enriched_output.append(doc)

        return enriched_output

    except Exception as e:
        print("❌ Error in /generate-emails:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update-emails")
async def update_emails(request: Request):
    try:
        updated_emails = await request.json()
        print("🔁 Incoming update payload:")
        for item in updated_emails:
            print(item)

            _id = item["_id"]
            if not ObjectId.is_valid(_id):
                raise ValueError(f"Invalid ObjectId: {_id}")

            collection.update_one(
                {"_id": ObjectId(_id)},
                {"$set": {"subject": item["subject"], "message": item["message"]}}
            )

        return {"status": "success", "updated": len(updated_emails)}

    except Exception as e:
        print("❌ Error in /update-emails:", e)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
