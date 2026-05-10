const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
        match: /^[6-9]\d{9}$/
    },
    room: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
