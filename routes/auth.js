const router = require("express").Router();

// 🔐 Store passwords here (change them)
const ADMIN_PASSWORD = "hbadmin2026";
const DEV_PASSWORD = "OPENFORDEV";

// ADMIN LOGIN
router.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
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
  }
  router.get("/check", (req, res) => {
    if (req.cookies.adminAuth === "true") {
      return res.json({ success: true });
    }
    res.status(401).json({ success: false });
  });

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
