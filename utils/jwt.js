const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET; // 🔥 change in production

function generateToken(user) {
  return jwt.sign(
    { phone: user.phone, name: user.name },
    SECRET,
    { expiresIn: "90d" } // 🔥 auto login for 7 days
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };
