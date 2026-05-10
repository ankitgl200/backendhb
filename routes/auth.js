const router = require("express").Router();
const jwt = require("jsonwebtoken");

// 🔐 ENV (use .env in production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "hbadmin2026";
const DEV_PASSWORD = process.env.DEV_PASSWORD || "OPENFORDEV";
const SECRET = process.env.JWT_SECRET;

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
  const { password } = req.body;

  if (password === DEV_PASSWORD) {
    const token = jwt.sign(
      { role: "dev" },
      SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      success: true,
      token
    });
  }

  res.json({ success: false });
});

// 🔐 VERIFY ADMIN TOKEN
router.get("/check", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.role === "admin" || decoded.role === "dev") {
      return res.json({ success: true });
    }

    res.status(403).json({ success: false });

  } catch {
    res.status(401).json({ success: false });
  }
});

// 🔐 LOGOUT (frontend just removes token)
router.post("/logout", (req, res) => {
  res.json({ success: true });
});

module.exports = router;
