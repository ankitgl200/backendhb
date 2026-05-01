const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  oprice: Number,
  stock: Number,
  cat: String,
  src: String
});

module.exports = mongoose.model("Product", productSchema);