import { useState } from 'react'
import './index.css'

export default function App() {
  const [isEditing, setIsEditing] = useState(false)

  // Current date
  const today = new Date()
  const formattedToday = today.toLocaleString() // shows current date + time
  // Date + 60 days
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + 60)
  const formattedFuture = futureDate.toLocaleDateString()

  const [fields, setFields] = useState({
    Originator: 'Sriram',
    Supervisor: 'Sridhar',
    'Quality Approver': 'Ramu',
    'Quality Reviewer': 'Ratni',
    'Date Opened': formattedToday,
    'Original Date Due': formattedFuture,
    'Date Due': formattedFuture,
    Title: 'Tablet hardness for ABC Tablets (Batch No: B1000) exceeded the limit'
  })

  const description = [
    'Tablet hardness for ABC Tablets (Batch No: B1000) exceeded the limit'
  ]

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Header */}
      <header className="top-bar">
        <div className="title-area">
          <h1 className="record-title">
            211 - {fields.Title}
          </h1>
          <div className="record-sub">Pending Data Review</div>
          <div className="record-sub">Created: {fields['Date Opened']}</div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs" role="tablist">
        {[
          'General Information',
          'Preliminary Investigation',
          'Review & Approve',
          'Record Closure'
        ].map((t, i) => (
          <button key={t} className={i === 0 ? 'tab active' : 'tab'}>
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
                    value={value}
                    onChange={e => handleChange(label, e.target.value)}
                  />
                ) : (
                  <span>{value || '—'}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button
            className="btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button
              className="btn"
              onClick={() => {
                console.log('Save clicked', fields)
                setIsEditing(false)
              }}
              style={{ marginLeft: 8 }}
            >
              Save
            </button>
          )}
        </div>

        <h3 className="desc-title">Description</h3>
        <div className="description">
          {description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </main>
    </div>
  )
}