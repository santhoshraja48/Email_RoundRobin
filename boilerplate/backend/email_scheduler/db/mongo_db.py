# mongo_db.py


from pymongo import MongoClient
import os
from load_dotenv import load_dotenv

load_dotenv()

def get_mongo_collection(collection_name):
    MONGO_URI = os.getenv("MONGODB_URI")
    client = MongoClient(MONGO_URI)
    db = client["sales_outreach"]
    return db[collection_name]

def insert_send_log(send_log, drop_existing=True):
    collection = get_mongo_collection("simulated_send_log")
    if drop_existing:
        collection.drop()
    if send_log:
        collection.insert_many(send_log)
        print(f"Inserted {len(send_log)} entries into MongoDB.")
    else:
        print("No entries to insert.")

# def get_email_accounts():
#     collection = get_mongo_collection("email_accounts")
#     return list(collection.find({}))

# Usage example:
# send_log = ... # Load from file
# insert_send_log(send_log)
# email_accounts = get_email_accounts()