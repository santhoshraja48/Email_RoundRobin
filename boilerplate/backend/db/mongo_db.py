from pymongo import MongoClient
import os
from simulate import send_log
# Connect to MongoDB (replace with your URI or use environment variable)
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://AkashSadasivam:Inf9443470894.4@sales.yk6xna3.mongodb.net/?retryWrites=true&w=majority")
client = MongoClient(MONGO_URI)
db = client["sales_outreach"]  # Use your DB name
collection = db["simulated_send_log"]  # Collection name

# Insert all send_log entries into MongoDB
if send_log:
    collection.insert_many(send_log)
    print(f"Inserted {len(send_log)} entries into MongoDB.")
else:
    print("No entries to insert.")