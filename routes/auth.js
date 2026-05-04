const router = require("express").Router();

// 🔐 Passwords
const ADMIN_PASSWORD = "hbadmin2026";
const DEV_PASSWORD = "OPENFORDEV";

// ✅ ADMIN LOGIN
router.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    res.cookie("adminAuth", "true", {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60
    });

    return res.json({ success: true });
  }

  res.json({ success: false });
});

// ✅ CHECK AUTH
router.get("/check", (req, res) => {
  if (req.cookies.adminAuth === "true") {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

// DEV MODE LOGIN (optional)
router.post("/dev-login", (req, res) => {
  const { password } = req.body;

  if (password === DEV_PASSWORD) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

router.post("/logout", (req, res) => {
  res.clearCookie("adminAuth");
  res.json({ success: true });
});
module.exports = router;
