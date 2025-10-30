
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import pytz
# ---------------- App Setup ----------------
app = Flask(__name__)
CORS(app)
# ---------------- MongoDB Setup ----------------
client = MongoClient("mongodb://localhost:27017/")
db = client["departmentDB"]
collection = db["selection"]
# ---------------- Default Departments ----------------
DEFAULT_DEPARTMENTS = [
    {"department": "Quality Assurance", "approval": False, "informed": False},
    {"department": "Quality Control", "approval": False, "informed": False},
    {"department": "Warehouse", "approval": False, "informed": False},
    {"department": "Regulatory Affairs", "approval": False, "informed": False},
    {"department": "Production Orals", "approval": False, "informed": False},
    {"department": "Microbiology", "approval": False, "informed": False},
    {"department": "Personnel and administration", "approval": False, "informed": False},
    {"department": "Customer", "approval": False, "informed": False}
]
# ---------------- Helper Functions ----------------
def get_main_doc():
    """Fetch or create the single main document."""
    doc = collection.find_one()
    if not doc:
        doc = {
            "departments": DEFAULT_DEPARTMENTS,
            "selectedDept": "",
            "incidentType": "",
            "history": [],
            "lastUpdated": datetime.utcnow()
        }
        collection.insert_one(doc)
    return doc

def get_ist_time():
    """Return IST timestamp."""
    return datetime.now(pytz.timezone("Asia/Kolkata"))

# ---------------- Routes ----------------
@app.route("/api/selection", methods=["GET"])
def get_selection():
    """Fetch the main document."""
    try:
        doc = get_main_doc()
        doc["_id"] = str(doc["_id"])
        return jsonify(doc), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/selection", methods=["POST"])
def update_selection():
    """Update department state, store only meaningful history entries."""
    try:
        data = request.json
        print("\n📩 Received update:", data)
        doc = get_main_doc()
        departments = doc["departments"]
        dept_name = data.get("department")
        approval = data.get("approval", False)
        informed = data.get("informed", False)
        selectedDept = data.get("selectedDept", "")
        incidentType = data.get("incidentType", "")
        # ✅ Update the department in place
        updated = False
        for dept in departments:
            if dept["department"] == dept_name:
                if dept["approval"] != approval or dept["informed"] != informed:
                    dept["approval"] = approval
                    dept["informed"] = informed
                    updated = True
        # ✅ Only record meaningful (true) changes
        if updated and (approval or informed):
            history_entry = {
                "timestamp": get_ist_time().isoformat(),
                "selectedDept": selectedDept,
                "incidentType": incidentType,
                "department": dept_name,
                "approval": approval,
                "informed": informed
            }
            collection.update_one(
                {},
                {
                    "$set": {
                        "departments": departments,
                        "selectedDept": selectedDept,
                        "incidentType": incidentType,
                        "lastUpdated": datetime.utcnow()
                    },
                    "$push": {"history": history_entry}
                }
            )
            print(f"✅ Change recorded for: {dept_name}")
            return jsonify({"message": f"Updated {dept_name}"}), 200
        else:
            # Still update department states even if no new approvals
            collection.update_one(
                {},
                {
                    "$set": {
                        "departments": departments,
                        "selectedDept": selectedDept,
                        "incidentType": incidentType,
                        "lastUpdated": datetime.utcnow()
                    }
                }
            )
            print(f"ℹ️ No change recorded for {dept_name}")
            return jsonify({"message": "No new changes recorded"}), 200
    except Exception as e:
        print("❌ Error updating selection:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/history", methods=["GET"])
def get_history():
    """Return history sorted by latest first."""
    try:
        doc = get_main_doc()
        history = sorted(doc.get("history", []), key=lambda x: x["timestamp"], reverse=True)
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history/clear", methods=["DELETE"])
def clear_history():
    """Clear the entire history."""
    try:
        collection.update_one({}, {"$set": {"history": []}})
        print("🧹 History cleared")
        return jsonify({"message": "History cleared"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/selection/reset", methods=["POST"])
def reset_selection():
    """Reset everything to default."""
    try:
        collection.delete_many({})
        collection.insert_one({
            "departments": DEFAULT_DEPARTMENTS,
            "selectedDept": "",
            "incidentType": "",
            "history": [],
            "lastUpdated": datetime.utcnow()
        })
        print("🔄 Database reset to default state")
        return jsonify({"message": "Reset successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- Run ----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)

