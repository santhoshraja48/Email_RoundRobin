import React, { useState } from "react";

export default function EmailAccountForm({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    smtp_server: "",
    smtp_port: 0,
    smtp_ssl: false,
    imap_server: "",
    imap_port: 0,
    imap_ssl: false,
    domain: "",
    daily_limit: 0,
    interval_time: 0,
    sent_today: 0,
    warmup_score: 0.0,
    reputation_score: 0.0,
  });

  const [bulkFile, setBulkFile] = useState(null);
  const [parsedAccounts, setParsedAccounts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMode, setUploadMode] = useState("single"); // 'single' or 'bulk'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue =
      type === "checkbox" ? checked : type === "number" ? Number(value) : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: parsedValue };
      if (name === "email") {
        const domainPart = value.split("@")[1] || "";
        updated.domain = domainPart;
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setBulkFile(file);
      setUploadMode("bulk");
      console.log("Selected CSV File:", file.name);
      parseCSVFile(file);
    } else {
      alert("Please select a valid CSV file");
      setBulkFile(null);
      setParsedAccounts([]);
      setUploadMode("single");
    }
  };

  const parseCSVFile = (file) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const lines = csvContent
          .split("\n")
          .filter((line) => line.trim() !== "");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const accounts = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim());
          const account = {
            email: values[0] || "",
            password: values[1] || "",
            smtp_server: values[2] || "",
            smtp_port: parseInt(values[3]) || 0,
            imap_server: values[4] || "",
            imap_port: parseInt(values[5]) || 0,
            domain: values[6] || "",
            daily_limit: parseInt(values[7]) || 0,
            interval_time: parseInt(values[8]) || 0,
            sent_today: parseInt(values[9]) || 0,
            warmup_score: parseFloat(values[10]) || 0.0,
            reputation_score: parseFloat(values[11]) || 0.0,
            smtp_ssl: false, // Default values for checkboxes
            imap_ssl: false,
          };

          // Auto-extract domain from email if not provided
          if (!account.domain && account.email) {
            account.domain = account.email.split("@")[1] || "";
          }

          return account;
        });

        setParsedAccounts(accounts);
        console.log(`Parsed ${accounts.length} email accounts from CSV`);
        setIsProcessing(false);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        alert("Error parsing CSV file. Please check the format.");
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (uploadMode === "bulk" && parsedAccounts.length > 0) {
        console.log("Uploading bulk email accounts:", parsedAccounts);

                  // Save all accounts to MongoDB
          const promises = parsedAccounts.map((account) =>
            fetch("http://127.0.0.1:5000/api/email-accounts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(account),
            })
          );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map((r) => r.json()));

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.length - successCount;

                  if (errorCount === 0) {
            alert(`Successfully saved ${successCount} email accounts!`);
            if (onNavigate) {
              onNavigate("to-email");
            }
          } else {
          alert(
            `Saved ${successCount} accounts, ${errorCount} failed. Check console for details.`
          );
          console.log("Bulk upload results:", results);
        }
      } else if (uploadMode === "single") {
        console.log("Submitting single email account:", formData);

                  // Save to MongoDB
          const response = await fetch("http://127.0.0.1:5000/api/email-accounts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

        if (response.ok) {
          const result = await response.json();
          console.log("Email account saved successfully:", result);
          alert("Email account saved successfully!");

          // Navigate to ToEmail page
          if (onNavigate) {
            onNavigate("to-email");
          }
        } else {
          const error = await response.json();
          console.error("Error saving email account:", error);
          alert("Error saving email account. Please try again.");
        }
      } else {
        alert("Please fill in the form or upload a CSV file");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Error submitting form. Please check your connection and try again."
      );
    }
  };

  const styles = {
    container: {
      maxWidth: "48rem",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "1.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1.5rem",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1.5rem",
    },
    fullRow: {
      gridColumn: "span 2",
    },
    label: {
      display: "block",
      fontWeight: "500",
      marginBottom: "0.25rem",
      color: "#374151",
      fontSize: "0.875rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    },
    checkbox: {
      marginRight: "0.5rem",
    },
    button: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "0.75rem",
      marginTop: "1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    backButton: {
      backgroundColor: "#6b7280",
      color: "#ffffff",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginBottom: "1rem",
    },
    preview: {
      marginTop: "2rem",
      padding: "1rem",
      backgroundColor: "#f8fafc",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
    },
    previewTitle: {
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#1f2937",
    },
    previewTable: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.75rem",
    },
    previewHeader: {
      backgroundColor: "#e5e7eb",
      padding: "0.5rem",
      textAlign: "left",
      fontWeight: "600",
      borderBottom: "1px solid #d1d5db",
    },
    previewCell: {
      padding: "0.5rem",
      borderBottom: "1px solid #e5e7eb",
      maxWidth: "120px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    processing: {
      textAlign: "center",
      color: "#6b7280",
      fontStyle: "italic",
    },
    instructions: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginTop: "1rem",
      padding: "1rem",
      backgroundColor: "#f0f9ff",
      borderRadius: "0.5rem",
      border: "1px solid #bae6fd",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Email Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <Field
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles}
          />
          <Field
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            style={styles}
          />

          <Field
            label="SMTP Server"
            name="smtp_server"
            value={formData.smtp_server}
            onChange={handleChange}
            style={styles}
          />
          <Field
            label="SMTP Port"
            name="smtp_port"
            value={formData.smtp_port}
            onChange={handleChange}
            type="number"
            style={styles}
          />
          <div style={styles.fullRow}>
            <label style={styles.label}>
              <input
                type="checkbox"
                name="smtp_ssl"
                checked={formData.smtp_ssl}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Use SSL for SMTP
            </label>
          </div>

          <Field
            label="IMAP Server"
            name="imap_server"
            value={formData.imap_server}
            onChange={handleChange}
            style={styles}
          />
          <Field
            label="IMAP Port"
            name="imap_port"
            value={formData.imap_port}
            onChange={handleChange}
            type="number"
            style={styles}
          />
          <div style={styles.fullRow}>
            <label style={styles.label}>
              <input
                type="checkbox"
                name="imap_ssl"
                checked={formData.imap_ssl}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Use SSL for IMAP
            </label>
          </div>

          <Field
            label="Domain (Auto-fetched)"
            name="domain"
            value={formData.domain}
            style={styles}
            disabled
          />
          <Field
            label="Daily Limit"
            name="daily_limit"
            value={formData.daily_limit}
            onChange={handleChange}
            type="number"
            style={styles}
          />
          <Field
            label="Interval Time (min)"
            name="interval_time"
            value={formData.interval_time}
            onChange={handleChange}
            type="number"
            style={styles}
          />
        </div>

        <div style={styles.grid3}>
          <Field
            label="Sent Today"
            name="sent_today"
            value={formData.sent_today}
            onChange={handleChange}
            type="number"
            style={styles}
          />
          <Field
            label="Warmup Score"
            name="warmup_score"
            value={formData.warmup_score}
            onChange={handleChange}
            type="number"
            style={styles}
          />
          <Field
            label="Reputation Score"
            name="reputation_score"
            value={formData.reputation_score}
            onChange={handleChange}
            type="number"
            style={styles}
          />
        </div>

        <div>
          <label style={styles.label}>Bulk Upload (CSV)</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.input}
          />
          <div style={styles.instructions}>
            <strong>CSV Format:</strong> email, password, smtp_server,
            smtp_port, imap_server, imap_port, domain, daily_limit,
            interval_time, sent_today, warmup_score, reputation_score
            <br />
            <br />
            <strong>Example:</strong>
            <br />
            john@example.com, mypassword123, smtp.gmail.com, 587,
            imap.gmail.com, 993, gmail.com, 50, 15, 0, 0.0, 100.0
            <br />
          </div>
        </div>

        <button type="submit" style={styles.button}>
          {uploadMode === "bulk"
            ? `Save ${parsedAccounts.length} Email Accounts`
            : "Save Email Account"}
        </button>
      </form>

      {/* Processing Indicator */}
      {isProcessing && (
        <div style={styles.processing}>Processing CSV file...</div>
      )}

      {/* Preview Section */}
      {parsedAccounts.length > 0 && !isProcessing && (
        <div style={styles.preview}>
          <div style={styles.previewTitle}>
            Preview ({parsedAccounts.length} email accounts loaded)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.previewTable}>
              <thead>
                <tr>
                  <th style={styles.previewHeader}>Email</th>
                  <th style={styles.previewHeader}>SMTP Server</th>
                  <th style={styles.previewHeader}>SMTP Port</th>
                  <th style={styles.previewHeader}>IMAP Server</th>
                  <th style={styles.previewHeader}>IMAP Port</th>
                  <th style={styles.previewHeader}>Domain</th>
                  <th style={styles.previewHeader}>Daily Limit</th>
                  <th style={styles.previewHeader}>Interval</th>
                </tr>
              </thead>
              <tbody>
                {parsedAccounts.slice(0, 5).map((account, index) => (
                  <tr key={index}>
                    <td style={styles.previewCell}>{account.email}</td>
                    <td style={styles.previewCell}>{account.smtp_server}</td>
                    <td style={styles.previewCell}>{account.smtp_port}</td>
                    <td style={styles.previewCell}>{account.imap_server}</td>
                    <td style={styles.previewCell}>{account.imap_port}</td>
                    <td style={styles.previewCell}>{account.domain}</td>
                    <td style={styles.previewCell}>{account.daily_limit}</td>
                    <td style={styles.previewCell}>{account.interval_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedAccounts.length > 5 && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              Showing first 5 of {parsedAccounts.length} accounts
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  style,
  disabled = false,
}) {
  return (
    <div>
      <label htmlFor={name} style={style.label}>
        {label}
      </label>
      <input
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={onChange}
        style={style.input}
        disabled={disabled}
      />
    </div>
  );
}
