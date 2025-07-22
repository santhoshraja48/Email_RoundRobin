import React, { useState } from "react";

const ToEmail = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setFileName(file.name);
      console.log("Selected CSV File:", file.name);
      parseCSVFile(file);
    } else {
      alert("Please select a valid CSV file");
      setCsvFile(null);
      setFileName("");
      setParsedData([]);
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

        const data = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim());
          const record = {
            id: values[0] || `lead_${index + 1}`,
            email: values[1] || "",
            name: values[2] || "",
            company: values[3] || "",
            industry: values[4] || "",
            company_size: parseInt(values[5]) || 0,
            title: values[6] || "",
            status: values[7] || "NEW",
            score: parseInt(values[8]) || 0,
            last_contacted: values[9] || null,
            reply_count: parseInt(values[10]) || 0,
            open_count: parseInt(values[11]) || 0,
            click_count: parseInt(values[12]) || 0,
          };
          return record;
        });

        setParsedData(data);
        console.log(`Parsed ${data.length} records from CSV`);
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
    if (csvFile && parsedData.length > 0) {
      console.log("Uploading CSV data:", parsedData);
      
      try {
        // Save all recipient records to MongoDB
        const promises = parsedData.map((record) =>
          fetch("http://127.0.0.1:5000/api/recipients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(record),
          })
        );

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map((r) => r.json()));

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.length - successCount;

        if (errorCount === 0) {
          alert(`Successfully uploaded ${successCount} recipient records to database!`);
          // You can navigate to the next step or reset the form
          setCsvFile(null);
          setFileName("");
          setParsedData([]);
        } else {
          alert(
            `Uploaded ${successCount} records, ${errorCount} failed. Check console for details.`
          );
          console.log("Bulk upload results:", results);
        }
      } catch (error) {
        console.error("Error uploading recipients:", error);
        alert("Error uploading recipients. Please check your connection and try again.");
      }
    } else {
      alert("Please select a valid CSV file first");
    }
  };

  const styles = {
    container: {
      maxWidth: "32rem",
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
      color: "#1f2937",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
    fileSection: {
      border: "2px dashed #d1d5db",
      borderRadius: "0.75rem",
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#f9fafb",
      transition: "border-color 0.3s ease",
    },
    fileSectionHover: {
      borderColor: "#3b82f6",
      backgroundColor: "#f0f9ff",
    },
    fileInput: {
      display: "none",
    },
    fileLabel: {
      display: "block",
      cursor: "pointer",
      fontSize: "1rem",
      color: "#374151",
    },
    fileIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#6b7280",
    },
    fileName: {
      marginTop: "1rem",
      padding: "0.5rem",
      backgroundColor: "#e5e7eb",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      color: "#374151",
    },
    button: {
      width: "100%",
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "1rem",
      borderRadius: "0.5rem",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#1d4ed8",
    },
    instructions: {
      fontSize: "0.875rem",
      color: "#6b7280",
      textAlign: "center",
      marginTop: "1rem",
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Upload Recipient Emails</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fileSection}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={styles.fileInput}
            id="csvFile"
          />
          <label htmlFor="csvFile" style={styles.fileLabel}>
            <div style={styles.fileIcon}>📁</div>
            <div>
              <strong>Click to upload CSV file</strong>
              <br />
              or drag and drop here
            </div>
          </label>
          {fileName && (
            <div style={styles.fileName}>Selected file: {fileName}</div>
          )}
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.button.backgroundColor;
          }}
        >
          Upload CSV File
        </button>

        <div style={styles.instructions}>
          <strong>CSV Format:</strong>email, name, company, industry,
          company_size, title, status, score, last_contacted, reply_count,
          open_count, click_count
          <br />
          <br />
          <strong>Example:</strong>
          <br />
          john@example.com, John Doe, TechCorp, Technology, 100, Senior
          Developer, NEW, 0, , 0, 0, 0<br />
        </div>
      </form>

      {/* Preview Section */}
      {isProcessing && (
        <div style={styles.processing}>Processing CSV file...</div>
      )}

      {parsedData.length > 0 && !isProcessing && (
        <div style={styles.preview}>
          <div style={styles.previewTitle}>
            Preview ({parsedData.length} records loaded)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.previewTable}>
              <thead>
                <tr>
                  <th style={styles.previewHeader}>ID</th>
                  <th style={styles.previewHeader}>Email</th>
                  <th style={styles.previewHeader}>Name</th>
                  <th style={styles.previewHeader}>Company</th>
                  <th style={styles.previewHeader}>Industry</th>
                  <th style={styles.previewHeader}>Size</th>
                  <th style={styles.previewHeader}>Title</th>
                  <th style={styles.previewHeader}>Status</th>
                  <th style={styles.previewHeader}>Score</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((record, index) => (
                  <tr key={index}>
                    <td style={styles.previewCell}>{record.id}</td>
                    <td style={styles.previewCell}>{record.email}</td>
                    <td style={styles.previewCell}>{record.name}</td>
                    <td style={styles.previewCell}>{record.company}</td>
                    <td style={styles.previewCell}>{record.industry}</td>
                    <td style={styles.previewCell}>{record.company_size}</td>
                    <td style={styles.previewCell}>{record.title}</td>
                    <td style={styles.previewCell}>{record.status}</td>
                    <td style={styles.previewCell}>{record.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedData.length > 5 && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              Showing first 5 of {parsedData.length} records
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToEmail;
