const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  logoutUser,
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");


// 📌 Register
router.post("/register", registerUser);

// 📌 Login
router.post("/login", loginUser);

// 📌 Get logged-in user
router.get("/me", authMiddleware, getMe);

// 📌 Update profile
router.put("/update", authMiddleware, updateProfile);

// 📌 Change password
router.put("/change-password", authMiddleware, changePassword);

// 📌 Logout (optional)
router.post("/logout", authMiddleware, logoutUser);


module.exports = router;