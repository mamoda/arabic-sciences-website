const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../dist"))); // or "../build" for CRA

const users = []; // In-memory user store

const SECRET = "your_jwt_secret";

// Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.json({ message: "Registered successfully" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected route example
app.get("/api/profile", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(auth.split(" ")[1], SECRET);
    res.json({ username: decoded.username });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));