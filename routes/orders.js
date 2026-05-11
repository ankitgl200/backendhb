const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/product");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("ORDERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PLACE ORDER
router.post("/place", auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      phone: req.user.phone // 🔐 secure
    });

    const savedOrder = await order.save();

    res.json({
      success: true,
      _id: savedOrder._id,
      createdAt: savedOrder.createdAt
    });

  } catch (err) {
    console.error("❌ Order save error:", err);
    res.status(500).json({ success: false });
  }
});

// GET ALL ORDERS (ADMIN)
// GET ALL ORDERS (ADMIN)
router.get("/", auth, async (req, res) => {
  // 🔐 ADMIN CHECK
  if (!req.user.role || req.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }

  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
// 🔥 GET ORDERS BY USER PHONE
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      phone: req.user.phone
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// UPDATE STATUS
router.post("/update", auth, async (req, res) => {
  const { id, status } = req.body;

  const order = await Order.findById(id);

  if (status === "delivered") {
    // 🔥 reduce stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.qty }
      });
    }
  }

  order.status = status;
  await order.save();

  res.json({ success: true });
});

// DELETE ORDER
router.post("/delete", auth, async (req, res) => {
  await Order.findByIdAndDelete(req.body.id);
  res.json({ success: true });
});

module.exports = router;
