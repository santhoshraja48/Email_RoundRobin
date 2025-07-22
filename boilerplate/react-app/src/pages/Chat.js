import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8000"; // update if needed

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch all messages on load
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch(`${API_URL}/messages/`);
    const data = await response.json();
    setMessages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    await fetch(`${API_URL}/messages/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    setMessage("");
    fetchMessages();
  };

  const handleClear = async () => {
  await fetch(`${API_URL}/messages/clear`, {
    method: 'DELETE',
  });
  fetchMessages(); // Refresh the message list
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
        <button type="button" style={styles.clearButton} onClick={handleClear}>
          Clear All
        </button>
      </form>

      <div style={styles.messageBox}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.message}>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f0f4f8",
    fontFamily: "sans-serif",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    flex: 1,
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  messageBox: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  message: {
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  clearButton: {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#dc3545',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
},
};

export default Chat;
