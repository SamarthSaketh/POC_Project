from flask import Flask, request, jsonify # Added jsonify for API responses
from flask_cors import CORS # Added CORS to allow the React frontend to connect
import pyodbc

app = Flask(__name__)
CORS(app) # Enable CORS for cross-origin communication

# Create a function to always return a fresh connection
def get_connection():
    # CONNECTION DETAILS
    return pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=testdb;"
        "Trusted_Connection=yes;"
    )

def insert_record(data):
    conn = get_connection()
    cursor = conn.cursor()
    # The SQL query remains the same, accepting 10 parameters (?)
    cursor.execute("""
        INSERT INTO GeneralInformation (
            Originator, Title, OriginalDateDue, DateOpened, DateDue,
            QualityApprover, QualityReviewer, SupervisorManager, Description, BatchNo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    """, data)
    conn.commit()
    cursor.close()
    conn.close()
 
# since the frontend is a separate React application.

@app.route("/submit", methods=["POST"])
def submit():
    # Use request.json to get the JSON payload sent by the React frontend
    data = request.json
    
    try:
        # Map the incoming JSON keys (from app.jsx) to the SQL INSERT order:
        data_tuple = (
            # 1. Originator
            data.get("Originator"),
            # 2. Title
            data.get("Title"),
            # 3. Original Date Due (Dates must be in YYYY-MM-DD format from UI.jsx)
            data.get("Original Date Due"),
            # 4. Date Opened
            data.get("Date Opened"),
            # 5. Date Due
            data.get("Date Due"),
            # 6. Quality Approver
            data.get("Quality Approver"),
            # 7. Quality Reviewer
            data.get("Quality Reviewer"),
            # 8. Supervisor (Maps to SupervisorManager in SQL)
            data.get("Supervisor"), 
            # 9. Description (Derived in UI.jsx)
            data.get("Description"), 
            # 10. BatchNo (Derived in UI.jsx)
            data.get("BatchNo")
        )
        
        insert_record(data_tuple)

        # Send a JSON success response back to the frontend
        return jsonify({
            "message": "Record inserted successfully", 
            "inserted_title": data.get("Title")
        }), 200

    except Exception as e:
        # Log the error and return a 500 status JSON response to the frontend
        print(f"Database insertion error: {e}")
        return jsonify({"message": f"Error saving data: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)