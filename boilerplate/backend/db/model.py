from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["sales_outreach"]  # Use your DB name
email_accounts_collection = db["email_accounts"]
recipients_collection = db["recipients"]

@app.route('/api/email-accounts', methods=['POST'])
def save_email_account():
    try:
        data = request.json
        
        # Add timestamp
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        
        # Insert into MongoDB
        result = email_accounts_collection.insert_one(data)
        
        return jsonify({
            'success': True,
            'message': 'Email account saved successfully',
            'id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        print(f"Error saving email account: {e}")
        return jsonify({
            'success': False,
            'message': 'Error saving email account',
            'error': str(e)
        }), 500

@app.route('/api/email-accounts', methods=['GET'])
def get_email_accounts():
    try:
        accounts = list(email_accounts_collection.find({}, {'_id': 0}))
        return jsonify({
            'success': True,
            'accounts': accounts
        }), 200
        
    except Exception as e:
        print(f"Error fetching email accounts: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching email accounts',
            'error': str(e)
        }), 500

@app.route('/api/recipients', methods=['POST'])
def save_recipient():
    try:
        data = request.json
        
        # Add timestamp
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        
        # Insert into MongoDB
        result = recipients_collection.insert_one(data)
        
        return jsonify({
            'success': True,
            'message': 'Recipient saved successfully',
            'id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        print(f"Error saving recipient: {e}")
        return jsonify({
            'success': False,
            'message': 'Error saving recipient',
            'error': str(e)
        }), 500

@app.route('/api/recipients', methods=['GET'])
def get_recipients():
    try:
        recipients = list(recipients_collection.find({}, {'_id': 0}))
        return jsonify({
            'success': True,
            'recipients': recipients
        }), 200
        
    except Exception as e:
        print(f"Error fetching recipients: {e}")
        return jsonify({
            'success': False,
            'message': 'Error fetching recipients',
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000) 