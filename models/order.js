const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  room: String,
  phone: String,
  items: Array,
  total: Number,
  status: { type: String, default: "pending" },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
