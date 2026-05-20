const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    room: String,
    password: String,

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },

    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("user", userSchema);
