const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mood-tracker')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Mood Schema
const moodSchema = new mongoose.Schema({
  mood: String,
  summary: String,
  timestamp: { type: Date, default: Date.now },
});

const Mood = mongoose.model("Mood", moodSchema);

// Define User Schema for authentication
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
// Save mood data
app.post("/api/moods", async (req, res) => {
  const { mood, summary } = req.body;
  try {
    const newMood = new Mood({ mood, summary });
    await newMood.save();
    res.status(201).json({ message: "Mood saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save mood." });
  }
});

// Fetch mood history
app.get("/api/moods", async (req, res) => {
  try {
    const moods = await Mood.find().sort({ timestamp: -1 });
    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch moods." });
  }
});

// User Registration (signup)
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user." });
  }
});

// User Login (authentication)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "yourSecretKey", { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
