const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5500;
const JWT_SECRET = "hostelbites_secret_key_2026";

// Middleware - ORDER MATTERS!
app.use(express.json());
app.use(cookieParser());

// FIX: Better CORS handling

app.use(cors({
  origin: true, // your frontend
  credentials: true
}));

// Auth middleware
async function auth(req, res, next) {
  try {
    const token = req.cookies.session;

    if (!token) {
      console.log("Auth failed: No session cookie found");
      return res.status(401).json({ success: false, message: "Login required - no session cookie" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
}

// DEBUG: Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'} - Cookie: ${req.headers.cookie ? 'present' : 'none'}`);
  next();
});

// DB connect
connectDB();

// Routes
app.use("/api/auths", require("./routes/auths"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/feedback", require("./routes/feedbacks"));

app.get("/", (req, res) => {
  res.send("Hostel Bites Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 CORS enabled for localhost/127.0.0.1 with credentials`);
  console.log(`⚠️  IMPORTANT: Open auth.html via http://localhost:${PORT}/../Frontend/files/auth.html or serve it with a local server`);
  console.log(`   Do NOT open auth.html directly (file:// protocol) - cookies won't work!`);
});
