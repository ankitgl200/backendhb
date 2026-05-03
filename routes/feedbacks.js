const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback"); // lowercase filename

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, room, type, message } = req.body;

    if (!name || !phone || !room || !type || !message) {
      return res.json({ success: false });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.json({ success: false });
    }

    const feedback = new Feedback({
      name,
      phone,
      email,
      room,
      type,
      message
    });

    await feedback.save();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
