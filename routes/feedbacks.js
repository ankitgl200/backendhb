const Feedback = require("./models/Feedback");

app.post("/api/feedback", async (req, res) => {
  try {
    const { name, phone, email, room, type, message } = req.body;

    // 🔒 Strong validation
    if (!name || !phone || !room || !type || !message) {
      return res.json({ success: false, message: "Missing fields" });
    }

    if (!/^[a-zA-Z ]{2,40}$/.test(name)) {
      return res.json({ success: false, message: "Invalid name" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.json({ success: false, message: "Invalid phone" });
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (!["review", "request"].includes(type)) {
      return res.json({ success: false, message: "Invalid type" });
    }

    if (message.length > 1000 || /[<>]/.test(message)) {
      return res.json({ success: false, message: "Invalid message" });
    }

    const feedback = new Feedback({
      name, phone, email, room, type, message
    });

    await feedback.save();

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});