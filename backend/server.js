const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentDB";

app.use(cors());
app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  regno: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true, trim: true }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

app.get("/", (req, res) => res.send("Student Management System API is running"));

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error("GET /students:", error.message);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, regno, department } = req.body || {};
    if (![name, regno, department].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ error: "Name, register number, and department are required." });
    }
    const student = await Student.create({
      name: name.trim(), regno: regno.trim(), department: department.trim()
    });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "Register number already exists." });
    if (error.name === "ValidationError") return res.status(400).json({ error: "Invalid student details." });
    console.error("POST /students:", error.message);
    res.status(500).json({ error: "Failed to add student." });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid student ID." });
    const { name, regno, department } = req.body || {};
    if (![name, regno, department].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ error: "Name, register number, and department are required." });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), regno: regno.trim(), department: department.trim() },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found." });
    res.json(student);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "Register number already exists." });
    console.error("PUT /students/:id:", error.message);
    res.status(500).json({ error: "Failed to update student." });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: "Invalid student ID." });
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("DELETE /students/:id:", error.message);
    res.status(500).json({ error: "Failed to delete student." });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully to studentDB");
    app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
    console.error("Make sure MongoDB Server is running or set MONGO_URI to a valid Atlas URI.");
    process.exit(1);
  });
