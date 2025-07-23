import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography, Row, Col } from 'antd';

const API_URL = 'http://localhost:8000';

function EmailLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [totalMails, setTotalMails] = useState(0);

  // Fetch total mails to send (from backend)
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch(`${API_URL}/api/total`);
        const data = await res.json();
        setTotalMails(data.total);
      } catch {
        setTotalMails(0);
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    let lastLogCount = 0;
    let lastUpdateTime = Date.now();

    const fetchLogs = async () => {
      const res = await fetch(`${API_URL}/api/logs`);
      const data = await res.json();
      setLoading(false);

      // Only append new logs
      if (logs.length === 0) {
        setLogs(data);
      } else if (data.length > logs.length) {
        setLogs(prev => [...prev, ...data.slice(prev.length)]);
        lastUpdateTime = Date.now();
      } else if (data.length < logs.length) {
        setLogs(data);
      }

      // Calculate estimated time remaining
      if (totalMails > 0 && data.length < totalMails) {
        const mailsLeft = totalMails - data.length;
        // Assume 6 seconds per mail (from backend logic)
        setEstimatedTime(mailsLeft * 6);
        setSending(true);
      } else {
        setEstimatedTime(0);
        setSending(false);
      }

      // If no new logs for 30 seconds, consider sending done
      if (data.length === lastLogCount && Date.now() - lastUpdateTime > 30000) {
        setSending(false);
      }
      lastLogCount = data.length;
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [logs, totalMails]);

  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time' },
    { title: 'Send Time', dataIndex: 'send_time', key: 'send_time' },
    { title: 'Sender', dataIndex: 'sender', key: 'sender' },
    { title: 'Recipient', dataIndex: 'recipient', key: 'recipient' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Typography.Title level={2}>Email Sending Log</Typography.Title>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={logs.map((log, idx) => ({ ...log, key: idx }))}
        pagination={false}
        style={{ marginBottom: 24 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {sending && (
          <>
            <Spin />
            <Typography.Text type="warning">
              Still sending... 
            </Typography.Text>
          </>
        )}
        {!sending && (
          <Typography.Text type="success">
            All mails sent or stopped.
          </Typography.Text>
        )}
      </div>
    </div>
  );
}

export default EmailLog;