const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
        match: /^[a-zA-Z ]+$/
    },
    phone: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/
    },
    email: {
        type: String,
        default: ""
    },
    room: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["review", "request"],
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Feedback", feedbackSchema);