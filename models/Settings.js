const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  shopOpen: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Settings", settingsSchema);