import { useState } from "react";
import "./index.css";

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Current date
  const today = new Date();
  const formattedToday = today.toLocaleDateString(); // only date
  // Date + 60 days
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 60);
  const formattedFuture = futureDate.toLocaleDateString();

  const [fields, setFields] = useState({
    Originator: "",
    Supervisor: "",
    "Quality Approver": "",
    "Quality Reviewer": "",
    "Date Opened": formattedToday,
    "Original Date Due": formattedFuture,
    "Date Due": formattedFuture,
    Title: "",
    Description: "",
    BatchNo: ""
  });

  const handleChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Saved: ${data.inserted_title}`);
        setIsEditing(false);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Error connecting to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="top-bar">
        <div className="title-area">
          <h1 className="record-title">211 - {fields.Title || "New Record"}</h1>
          <div className="record-sub">Pending Data Review</div>
          <div className="record-sub">
            Created: {fields["Date Opened"] || "—"}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs" role="tablist">
        {[
          "General Information",
          "Preliminary Investigation",
          "Review & Approve",
          "Record Closure",
        ].map((t, i) => (
          <button key={t} className={i === 0 ? "tab active" : "tab"}>
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="content">
        <h2 className="section-title">General Information</h2>

        <div className="info-grid">
          {Object.entries(fields).map(([label, value]) => (
            <div className="info-row" key={label}>
              <div className="label">{label}</div>
              <div className="value">
                {isEditing ? (
                  <input
                    className="edit-input"
                    type={label.toLowerCase().includes("date") ? "date" : "text"}
                    value={value}
                    onChange={(e) => handleChange(label, e.target.value)}
                  />
                ) : (
                  <span>{value || "—"}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons only for General Information */}
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit General Info"}
          </button>
          {isEditing && (
            <button
              className="btn"
              onClick={handleSave}
              style={{ marginLeft: 8 }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>

        {message && <div style={{ marginTop: 10 }}>{message}</div>}

        {/* Description (unchanged) */}
        <h3 className="desc-title">Description</h3>
        <div className="description">
          <p>{fields.Description || "—"}</p>
        </div>
      </main>
    </div>
  );
}
