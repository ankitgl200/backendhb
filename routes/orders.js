const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/product");

// PLACE ORDER
router.post("/place", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ success: true });
});

// GET ALL ORDERS (ADMIN)
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// UPDATE STATUS
router.post("/update", async (req, res) => {
  const { id, status } = req.body;

  const order = await Order.findById(id);

  if (status === "accepted") {
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
router.post("/delete", async (req, res) => {
  await Order.findByIdAndDelete(req.body.id);
  res.json({ success: true });
});

module.exports = router;