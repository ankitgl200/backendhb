const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "hostelbites_secret_key_2026";

// Helper: Validate inputs
function validateRegisterInput(data) {
    const { name, phone, room, password, role } = data;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters");
    if (!phone || !/^[0-9]{10}$/.test(phone)) errors.push("Phone must be 10 digits");
    if (!password || password.length < 4) errors.push("Password must be at least 4 characters");
    if (!room) errors.push("Room is required");
    if (!role || !["customer", "admin"].includes(role)) errors.push("Invalid role");

    return errors;
}

function validateLoginInput(data) {
    const { phone, password } = data;
    const errors = [];

    if (!phone || !/^[0-9]{10}$/.test(phone)) errors.push("Phone must be 10 digits");
    if (!password || password.length < 4) errors.push("Password must be at least 4 characters");

    return errors;
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // FIX: Validate inputs before processing
        const validationErrors = validateRegisterInput(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ success: false, message: validationErrors.join(", ") });
        }

        const { name, phone, room, password, role } = req.body;

        const existing = await User.findOne({ phone });
        if (existing) {
            return res.status(409).json({ success: false, message: "Phone already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            name: name.trim(),
            phone: phone.trim(),
            room,
            password: hashed,
            role,
            isApproved: role === "admin" ? false : true
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: role === "admin" ? "Waiting for admin approval" : "Registered successfully"
        });

    } catch (err) {
        console.error("Register error:", err);
        // FIX: Return proper 500 status on error
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // FIX: Validate inputs
        const validationErrors = validateLoginInput(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ success: false, message: validationErrors.join(", ") });
        }

        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user) return res.status(401).json({ success: false, message: "Invalid phone or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Invalid phone or password" });

        if (user.role === "admin" && !user.isApproved) {
            return res.status(403).json({ success: false, message: "Admin not approved" });
        }

        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("session", token, {
            httpOnly: true,
            sameSite: "none",   // 🔥 VERY IMPORTANT
            secure: false,      // true if using HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        console.log("Login successful for:", phone, "- Cookie set");

        res.json({
            success: true,
            role: user.role,
            user: {
                name: user.name,
                phone: user.phone,
                room: user.room,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET PROFILE
router.get("/me", async (req, res) => {
    try {
        const token = req.cookies.session;

        if (!token) {
            console.log("/me: No session cookie found");
            return res.status(401).json({ success: false, message: "No token" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (err) {
        console.log("/me error:", err.message);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    res.clearCookie("session", { path: "/" });
    res.json({ success: true, message: "Logged out" });
});

// ADMIN APPROVAL
router.get("/pending-admins", async (req, res) => {
    try {
        const users = await User.find({ role: "admin", isApproved: false });
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/approve", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).json({ success: false, message: "User ID required" });
        await User.findByIdAndUpdate(req.body.id, { isApproved: true });
        res.json({ success: true, message: "Admin approved" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/reject", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).json({ success: false, message: "User ID required" });
        await User.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Admin rejected" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;