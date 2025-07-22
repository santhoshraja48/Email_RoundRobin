# db/account_loader.py
from db.mongo_db import get_mongo_collection

def get_email_accounts():
    collection = get_mongo_collection("email_accounts")
    return list(collection.find({}))
