const express = require("express");
const router  = express.Router();

const {
  // Registration OTP flow
  sendRegisterOtp,
  verifyRegisterOtp,
  registerUser,

  // Auth
  loginUser,
  logoutUser,

  // Profile
  getMe,
  updateProfile,
  changePassword,

  // Forgot password flow
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

// ── Pre-registration OTP (no auth) ───────────────────────────
router.post("/send-register-otp",   sendRegisterOtp);   // Step 1: send OTP to email
router.post("/verify-register-otp", verifyRegisterOtp); // Step 2: verify OTP
router.post("/register",            registerUser);       // Step 3: create account

// ── Auth ─────────────────────────────────────────────────────
router.post("/login",               loginUser);
router.post("/logout",              authMiddleware, logoutUser);

// ── Forgot password (no auth) ─────────────────────────────────
router.post("/forgot-password",     forgotPassword);    // Step 1: send OTP to existing user
router.post("/verify-otp",          verifyOtp);          // Step 2: verify OTP
router.post("/reset-password",      resetPassword);      // Step 3: set new password

// ── Protected ─────────────────────────────────────────────────
router.get ("/me",                  authMiddleware, getMe);
router.put ("/profile",             authMiddleware, updateProfile); // used by Profile.js
router.put ("/update",              authMiddleware, updateProfile); // legacy alias
router.put ("/change-password",     authMiddleware, changePassword);

module.exports = router;