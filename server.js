require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true,
  credentials: true
}));

// DB connect
connectDB();
function adminOnly(req, res, next) {
  if (req.cookies.adminAuth === "true") return next();
  res.status(401).json({ message: "Unauthorized" });
}

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/feedback", require("./routes/feedbacks"));
app.use("/api/overview", require("./routes/overview"));

app.get("/", (req, res) => {
  res.send("Hostel Bites Backend Running 🚀");
});

// ✅ FIXED
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
