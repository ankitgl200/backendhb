const router = require("express").Router();

// 🔐 Store passwords here (change them)
const ADMIN_PASSWORD = "hbadmin2026";
const DEV_PASSWORD = "OPENFORDEV";

// ADMIN LOGIN
router.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// DEV MODE LOGIN
router.post("/dev-login", (req, res) => {
  const { password } = req.body;

  if (password === DEV_PASSWORD) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

module.exports = router;