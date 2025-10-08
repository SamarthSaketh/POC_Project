from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId # Helpful for getting the ID back

app = Flask(__name__)
CORS(app) 

# 🚨 1. CONNECTION DETAILS - REPLACE WITH YOUR ATLAS URI 🚨
# Example: mongodb+srv://AppUser:YourStrongPassword@cluster0.abcde.mongodb.net/
MONGO_URI = "mongodb+srv://monikars82696_db_user:Monika123@cluster01.nslata7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01"
DATABASE_NAME = "testdb" # The database name you want to use
COLLECTION_NAME = "GeneralInformation" 

# Establish a connection client 
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client[DATABASE_NAME]
general_info_collection = mongo_db[COLLECTION_NAME]

# 2. REMOVE old get_connection() function

def insert_record(data_document):
    """Inserts a single document (record) into the MongoDB collection."""
    try:
        result = general_info_collection.insert_one(data_document)
        # return the ID of the inserted document
        return str(result.inserted_id)
        
    except Exception as e:
        # In a real app, you would log the error here
        raise Exception(f"MongoDB insertion error: {e}")

@app.route("/submit", methods=["POST"])
def submit():
    # Ensure all required packages are installed: pip install Flask Flask-CORS pymongo
    data = request.json
    
    if not data:
        return jsonify({"message": "Invalid JSON data received."}), 400
        
    try:
        # Create the document using the data from the front-end form
        data_document = {
            "originator": data.get("Originator"),
            "title": data.get("Title"),
            "original_date_due": data.get("Original Date Due"),
            "date_opened": data.get("Date Opened"),
            "date_due": data.get("Date Due"),
            "quality_approver": data.get("Quality Approver"),
            "quality_reviewer": data.get("Quality Reviewer"),
            "supervisor_manager": data.get("Supervisor"),
            "description": data.get("Description"), 
            "batch_no": data.get("BatchNo"),
            "submission_timestamp": datetime.utcnow()
        }
        
        inserted_id = insert_record(data_document)

        return jsonify({
            "message": "Record inserted successfully into MongoDB Atlas", 
            "inserted_title": data_document.get("title"),
            "mongo_id": inserted_id
        }), 200

    except Exception as e:
        return jsonify({"message": f"Error saving data to database: {str(e)}"}), 500

if __name__ == "__main__":
    # Ensure you are not running app.run() in production!
    app.run(debug=True, host='0.0.0.0', port=5000)