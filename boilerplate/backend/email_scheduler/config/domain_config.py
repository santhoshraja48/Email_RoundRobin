
# domain_config.py
from db.account_loader import get_email_accounts


class EmailAccount:
    def __init__(self, email, password, smtp_server, smtp_port, imap_server, imap_port, domain, daily_limit, interval_time, sent_today=0, warmup_score=0.0, reputation_score=0.0):
        self.email = email
        self.password = password
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.imap_server = imap_server
        self.imap_port = imap_port
        self.domain = domain
        self.daily_limit = daily_limit
        self.interval_time = interval_time
        self.sent_today = sent_today
        self.warmup_score = warmup_score
        self.reputation_score = reputation_score

# Fetch accounts from DB
accounts_data = get_email_accounts()
email_accounts = [
    EmailAccount(
        email=acc.get("email"),
        password=acc.get("password"),
        smtp_server=acc.get("smtp_server"),
        smtp_port=acc.get("smtp_port"),
        imap_server=acc.get("imap_server"),
        imap_port=acc.get("imap_port"),
        domain=acc.get("domain"),
        daily_limit=acc.get("daily_limit"),
        interval_time=acc.get("interval_time"),
        sent_today=acc.get("sent_today", 0),
        warmup_score=acc.get("warmup_score", 0.0),
        reputation_score=acc.get("reputation_score", 0.0)
    )
    for acc in accounts_data
]

# Build domain_config mapping
domain_config = {}
for acc in email_accounts:
    domain = acc.domain
    if domain not in domain_config:
        domain_config[domain] = {
            "senders": [],
            "time_interval_minutes": acc.interval_time,
            "max_per_day": acc.daily_limit
        }
    sender_name = acc.email.split('@')[0]
    domain_config[domain]["senders"].append(sender_name)

print(domain_config)