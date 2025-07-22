# Email Round Robin Application

This application consists of a React frontend and Flask backend with MongoDB integration.

## Project Structure

```
boilerplate/
├── react-app/          # React frontend
├── backend/           # Flask backend
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd boilerplate/backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask backend:**
   ```bash
   python app.py
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to React app directory:**
   ```bash
   cd boilerplate/react-app
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Run the React development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## Features

### Email Accounts (InputGet.js)
- Configure sender email accounts with SMTP/IMAP settings
- Save email account data to MongoDB
- Automatic domain extraction from email
- Bulk CSV upload support

### Recipient Emails (ToEmail.js)
- Upload recipient lists via CSV
- Supports comprehensive lead schema
- Preview uploaded data
- Real-time CSV parsing

## API Endpoints

- `POST /api/email-accounts` - Save email account
- `GET /api/email-accounts` - Get all email accounts
- `GET /api/health` - Health check

## MongoDB Schema

### Email Accounts Collection
```javascript
{
  email: String,
  password: String,
  smtp_server: String,
  smtp_port: Number,
  smtp_ssl: Boolean,
  imap_server: String,
  imap_port: Number,
  imap_ssl: Boolean,
  domain: String,
  daily_limit: Number,
  interval_time: Number,
  sent_today: Number,
  warmup_score: Number,
  reputation_score: Number,
  created_at: Date,
  updated_at: Date
}
```

### Recipients Schema
```javascript
{
  id: String,
  email: String,
  name: String,
  company: String,
  industry: String,
  company_size: Number,
  title: String,
  status: String,
  score: Number,
  last_contacted: Date,
  reply_count: Number,
  open_count: Number,
  click_count: Number
}
```

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Use the sidebar navigation to switch between Email Accounts and Email Campaign
4. Fill in email account details and save to MongoDB
5. Upload recipient CSV files for email campaigns

## Environment Variables

The backend uses the following environment variable:
- `MONGO_URI` - MongoDB connection string (defaults to provided connection) 