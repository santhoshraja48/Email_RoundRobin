
# simulate.py

from datetime import datetime, timedelta
from collections import deque
from config.domain_config import domain_config
from data.leads import leads
from utils.email_utils import generate_subject_message

def run_simulation():
    domain_state = {}
    simulated_now = datetime.now().replace(second=0, microsecond=0)

    for domain, config in domain_config.items():
        domain_state[domain] = {
            "sender_queue": deque(config["senders"]),
            "last_sent_time": simulated_now - timedelta(minutes=config["time_interval_minutes"]),
            "per_sender_count": {sender: 0 for sender in config["senders"]}
        }

    send_log = []
    while leads:
        for domain, config in domain_config.items():
            state = domain_state[domain]
            interval = timedelta(minutes=config["time_interval_minutes"])

            if simulated_now - state["last_sent_time"] >= interval:
                tried_senders = 0
                while tried_senders < len(state["sender_queue"]):
                    sender = state["sender_queue"].popleft()
                    if state["per_sender_count"][sender] < config["max_per_day"]:
                        if leads:
                            lead = leads.popleft()
                            full_sender = f"{sender}@{domain}"
                            subject, message = generate_subject_message(full_sender, lead)
                            log_entry = {
                                "time": simulated_now.strftime('%H:%M:%S'),
                                "sender": full_sender,
                                "recipient": lead,
                                "domain": domain,
                                "subject": subject,
                                "message": message
                            }
                            send_log.append(log_entry)
                            state["per_sender_count"][sender] += 1
                            state["last_sent_time"] = simulated_now
                            state["sender_queue"].append(sender)
                            break
                    state["sender_queue"].append(sender)
                    tried_senders += 1
        simulated_now += timedelta(minutes=1)

    for entry in send_log:
        print(f"{entry['time']} || Subject: {entry['subject']:<10} | Message: {entry['message']:<25} | Domain: {entry['domain']}")

    return send_log
