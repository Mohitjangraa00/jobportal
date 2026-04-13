const jwt = require("jsonwebtoken");
const User = require("../models/User");


// 🔐 Protect Routes (Authentication Required)
exports.authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};



// 🔐 Role-Based Authorization (Optional but Recommended)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Role (${req.user.role}) not allowed`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};