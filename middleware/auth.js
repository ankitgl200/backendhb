const { verifyToken } = require("../utils/jwt");

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // 🔥 attach user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
