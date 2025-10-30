import os
from dotenv import load_dotenv
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/department_db")
PORT = int(os.getenv("PORT", 5000))
