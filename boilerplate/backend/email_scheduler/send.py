# send.py
import time
from datetime import datetime, timedelta
from collections import deque
from config.domain_config import domain_config
# send.py
from simulate import run_simulation
from db.mongo_db import insert_send_log
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
# Connect to MongoDB
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client["sales_outreach"]
collection = db["simulated_send_log"]

# Load send plan from MongoDB
send_plan = deque(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id field


# Internal state per domain
domain_state = {}
current_time = datetime.now()

# Initialize domain state (queue, last sent time, sender limits)
for domain, config in domain_config.items():
    domain_state[domain] = {
        "sender_queue": deque(config["senders"]),
        "last_sent_time": current_time - timedelta(minutes=config["time_interval_minutes"]),
        "per_sender_count": {sender: 0 for sender in config["senders"]}
    }

# Dummy send function (replace with actual email logic if needed)
def send_email(sender, recipient, subject, message):
    print(f"{datetime.now().strftime('%H:%M:%S')} | SENT | {sender:<25} → {recipient:<25} | Subject: {subject} | Message: {message}")

# Real-time sending loop
while send_plan:
    for domain, config in domain_config.items():
        state = domain_state[domain]
        now = datetime.now()
        interval = timedelta(minutes=config["time_interval_minutes"])

        if now - state["last_sent_time"] >= interval:
            tried_senders = 0
            while tried_senders < len(state["sender_queue"]):
                sender = state["sender_queue"].popleft()
                full_sender = f"{sender}@{domain}"

                if state["per_sender_count"][sender] < config["max_per_day"]:
                    if send_plan:
                        entry = send_plan[0]  # Peek

                        if entry['sender'] == full_sender:
                            entry = send_plan.popleft()

                            recipient = entry['recipient']
                            subject = entry['subject']
                            message = entry['message']

                            send_email(full_sender, recipient, subject, message)

                            # Update tracking
                            state["per_sender_count"][sender] += 1
                            state["last_sent_time"] = now
                            state["sender_queue"].append(sender)
                            break  # sent from this domain
                state["sender_queue"].append(sender)
                tried_senders += 1

    time.sleep(6)  # Sleep to simulate delay (represents ~1 minute in real logic)


if __name__ == "__main__":
    send_log = run_simulation()
    insert_send_log(send_log)