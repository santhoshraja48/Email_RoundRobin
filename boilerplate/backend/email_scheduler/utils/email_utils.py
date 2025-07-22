def generate_subject_message(sender, recipient):
    name = recipient.split('@')[0].capitalize()
    sender_name = sender.split('@')[0].capitalize()
    subject = f"Hello {name} from {sender_name}"
    message = f"This is a message from {sender} to {recipient}."
    return subject, message

