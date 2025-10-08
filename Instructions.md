
# MongoDB and Project Setup Guide

Hey team 👋  

Follow these steps to set up MongoDB Compass and run both the backend and frontend of the project.

---

## 1. Install MongoDB Compass

1. Download MongoDB Compass: [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)  
2. Install it using the default options.

---

## 2. Connect to MongoDB

1. Open **MongoDB Compass**.  
2. Click **“New Connection”**.  
3. Paste the **MongoDB connection URL**:  
```

  mongodb+srv://monikars82696_db_user:Monika123@cluster01.nslata7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01
   ```  
4. Click **Connect**.  
5. You should now see the database and collections used in the project.

---

## 3. Run the Backend

1. Open a terminal in the **backend folder** (where `MongoDB_app_Backend.py` is located).
2. Start the backend server:

```bash
python MongoDB_app_Backend.py
```

✅ Ensure the backend starts without errors.

---

## 4. Run the Frontend

1. Open a terminal in the **frontend folder**.
2. Install dependencies (if not done already):

```bash
npm install
```

3. Start the frontend server:

```bash
npm run dev
```

✅ The frontend should now be running and connect to your backend & MongoDB.

---

### ⚠️ Notes

* Always **connect MongoDB Compass** before running the backend.
* Make sure **backend is running** before starting frontend.
* Pull the latest changes from the repo before starting work:

```bash
git pull origin <branch-name>
```

