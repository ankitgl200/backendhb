// 🔐 ENV (use .env in production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEV_PASSWORD = process.env.DEV_PASSWORD;
const SECRET = process.env.JWT_SECRET;


const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");


// 🔐 ADMIN LOGIN
router.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: "admin" },
      SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      token
    });
  }

  res.json({ success: false });
});

// 🔐 DEV LOGIN (optional)
router.post("/dev-login", (req, res) => {
  try {
    const { password } = req.body;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    if (password === DEV_PASSWORD) {
      const token = jwt.sign(
        { role: "dev" },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );

      return res.json({ success: true, token });
    }

    res.json({ success: false });

  } catch (err) {
    console.error("DEV LOGIN ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});




// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, room } = req.body;

    if (!name || !phone || !room) {
      return res.json({ success: false, message: "Missing data" });
    }

    let existing = await User.findOne({ phone });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const user = new User({
      name,
      phone,
      room
    });

    await user.save();

    const token = jwt.sign(
      { phone: user.phone, name: user.name, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const token = jwt.sign(
      { phone: user.phone, name: user.name, role: "user" },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 🔐 VERIFY ADMIN TOKEN
router.get("/check", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: decoded
    });

  } catch (err) {
    res.status(401).json({ success: false });
  }
});

// 🔐 LOGOUT (frontend just removes token)
router.post("/logout", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
