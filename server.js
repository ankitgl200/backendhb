const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/feedback", require("./routes/feedback"));

app.get("/", (req, res) => {
  res.send("Hostel Bites Backend Running 🚀");
});

// ✅ FIXED
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
