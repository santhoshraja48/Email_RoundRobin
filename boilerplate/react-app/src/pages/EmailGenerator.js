import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Modal, message as antdMessage, Pagination } from 'antd';
import 'antd/dist/reset.css';
import './styles.css';
import { useNavigate } from 'react-router-dom';


const { TextArea } = Input;



function App() {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState({ visible: false, field: '', value: '', index: -1 });
  const pageSize = 10;

  // const totalPages = Math.ceil(emails.length / pageSize);
  const paginatedEmails = emails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const fetchEmails = async () => {
    try {
      const res = await fetch('http://localhost:8000/fetch-emails');
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      antdMessage.error('Failed to fetch email data');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleChange = (idx, field, value) => {
    setEmails((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/generate-emails', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setEmails(data);
        antdMessage.success('Generated subject & body successfully!');
      } else {
        antdMessage.error('Failed to generate emails.');
      }
    } catch (err) {
      antdMessage.error('API error: ' + err.message);
    }
    setLoading(false);
  };

  const handleVerifyAndSend = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/update-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emails),
      });
  
      const data = await res.json();
      console.log("🔁 Response OK:", res.ok);
      console.log("📦 Response JSON:", data);

    if (res.ok && data.status === "success") {
      Modal.success({
        title: '✅ Success',
        content: `Successfully verified and sent ${data.updated} emails!`,
      });

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate('/finalpage');  // <- Make sure your route matches
      }, 1500);
    } else {
      Modal.error({
        title: '❌ Error',
        content: `Failed to update emails: ${data.detail || 'Unknown error'}`,
      });
    }
  } catch (err) {
    Modal.error({
      title: '❌ Network Error',
      content: err.message,
    });
  }
  setLoading(false);
  };
  

  const openEditModal = (field, value, idx) => {
    setEditModal({ visible: true, field, value, index: idx });
  };

  const handleModalSave = () => {
    const globalIndex = (currentPage - 1) * pageSize + editModal.index;
    handleChange(globalIndex, editModal.field, editModal.value);
    setEditModal({ visible: false, field: '', value: '', index: -1 });
  };

  return (
    <div className="app-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      <Card className="app-card" bodyStyle={{ padding: 32 }}>
        <h2 className="app-title">Email Generator</h2>

        <div className="email-grid">
          {paginatedEmails.map((email, idx) => (
            <div key={email._id} className="email-block">
              <div className="email-row">
                <div className="email-half">
                  <div className="email-label">From:</div>
                  <Input value={email.sender} readOnly className="email-input" />
                </div>
                <div className="email-half">
                  <div className="email-label">To:</div>
                  <Input value={email.recipient} readOnly className="email-input" />
                </div>
              </div>
              <div className="email-row">
                <div className="email-half">
                  <div className="email-label">Subject:</div>
                  <Input
                    value={email.subject}
                    onClick={() => openEditModal('subject', email.subject, idx)}
                    readOnly
                    className="email-input clickable"
                  />
                </div>
                <div className="email-half">
                  <div className="email-label">Message:</div>
                  <TextArea
                    value={email.message}
                    onClick={() => openEditModal('message', email.message, idx)}
                    readOnly
                    className="email-input clickable"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-buttons">
          <Pagination
            current={currentPage}
            total={emails.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>

        <div className="footer-actions" style={{display : 'flex' , justifyContent : "space-between"}}>
          <Button type="primary" loading={loading} onClick={handleGenerate} className="action-button">
            Generate Emails
          </Button>
          <Button onClick={handleVerifyAndSend} disabled={loading} className="action-button verify-button">
            Verify & Send
          </Button>
        </div>
      </Card>

      <Modal
        title={`Edit ${editModal.field}`}
        open={editModal.visible}
        onOk={handleModalSave}
        onCancel={() => setEditModal({ visible: false, field: '', value: '', index: -1 })}
        okText="Save"
        cancelText="Cancel"
      >
        {editModal.field === 'message' ? (
          <TextArea
            rows={4}
            value={editModal.value}
            onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
          />
        ) : (
          <Input
            value={editModal.value}
            onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;