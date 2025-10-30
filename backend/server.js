import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/departmentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Define Schema
const departmentSchema = new mongoose.Schema({
  department: String,
  approval: Boolean,
  informed: Boolean,
});

const recordSchema = new mongoose.Schema({
  selectedDept: String,
  incidentType: String,
  departments: [departmentSchema],
  timestamp: { type: Date, default: Date.now },
});

const Record = mongoose.model("Record", recordSchema);

// ✅ POST - Save a record
app.post("/api/selection", async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET - Fetch all records (for previous entries)
app.get("/api/selection", async (req, res) => {
  try {
    const records = await Record.find().sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
