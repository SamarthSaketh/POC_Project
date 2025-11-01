from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["deviationForm"]
collection = db["forms"]

# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Server is running..."})

# Save form route
@app.route("/api/form", methods=["POST"])
def save_form():
    try:
        data = request.json
        new_entry = {
            "title": data.get("title", ""),
            "description": data.get("description", ""),
            "standard": data.get("standard", ""),
            "standardNA": data.get("standardNA", False),
            "immediateAction": data.get("immediateAction", ""),
            "actionNA": data.get("actionNA", False),
            "reviewerRemarks": data.get("reviewerRemarks", ""),
            "investigation": data.get("investigation", ""),
            "createdAt": datetime.utcnow().isoformat()
        }
        result = collection.insert_one(new_entry)
        return jsonify({"message": "✅ Data saved successfully", "id": str(result.inserted_id)}), 201
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"message": str(e)}), 500

# Get all forms (optional)
@app.route("/api/forms", methods=["GET"])
def get_forms():
    forms = list(collection.find({}, {"_id": 0}))  # Exclude _id
    return jsonify(forms), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"🚀 Server running on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
