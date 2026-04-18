const User   = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { sendOtp, verifyOtp: checkOtp, clearOtp } = require("../utils/otpService");

// ─── In-memory OTP store for pre-registration ────────────────
// Key: email  Value: { otp, expiresAt, verified, name }
const registerOtpStore = new Map();

// Auto-clean expired entries every 15 min
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of registerOtpStore)
    if (new Date(v.expiresAt).getTime() < now) registerOtpStore.delete(k);
}, 15 * 60 * 1000);

// ─── Helpers ──────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const userResponse = (u) => ({
  id:         u._id,
  name:       u.name,
  email:      u.email,
  role:       u.role,
  profilePic: u.profilePic || "",
  title:      u.title      || "",
  location:   u.location   || "",
  phone:      u.phone      || "",
  bio:        u.bio        || "",
  skills:     u.skills     || [],
  linkedin:   u.linkedin   || "",
  github:     u.github     || "",
});

const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER/EMAIL_PASS not set in .env — email not sent");
    return;
  }
  const nodemailer  = require("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({ from: `"JobPortal" <${process.env.EMAIL_USER}>`, to, subject, html });
};

const otpHtml = (name, otp, title, body) => `
  <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
    <h2 style="color:#0f2027;margin:0 0 12px;">${title}</h2>
    <p style="color:#64748b;line-height:1.6;margin:0 0 24px;">Hi <strong>${name||"there"}</strong>, ${body}</p>
    <div style="background:#f8fafc;border:2px dashed #6366f1;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:11px;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;">Your 6-digit code</p>
      <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#0f2027;font-family:monospace;">${otp}</span>
    </div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:20px;">
      <p style="margin:0;font-size:13px;color:#92400e;">⏰ Expires in <strong>10 minutes</strong>. Do not share this code.</p>
    </div>
    <p style="margin:0;font-size:12px;color:#94a3b8;">If you didn't request this, ignore this email.</p>
  </div>`;

// ════════════════════════════════════════════════════════════
//  STEP A — Send OTP before registration
// ════════════════════════════════════════════════════════════
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name)
      return res.status(400).json({ message: "Email and name are required" });

    const cleanEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(400).json({ message: "An account with this email already exists" });

    const otp       = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    registerOtpStore.set(cleanEmail, { otp, expiresAt, verified: false, name });

    console.log(`\n🔑 REGISTER OTP for ${cleanEmail}: ${otp}\n`);

    try {
      await sendEmail(
        cleanEmail,
        "JobPortal — Verify your email to complete signup",
        otpHtml(name, otp, "Verify your email",
          "use the code below to verify your email and complete registration.")
      );
    } catch (e) {
      if (process.env.NODE_ENV === "production") throw e;
      console.warn("Dev: email not sent —", e.message);
    }

    return res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("SEND REGISTER OTP:", error);
    return res.status(500).json({ message: "Failed to send code. Try again." });
  }
};

// ════════════════════════════════════════════════════════════
//  STEP B — Verify pre-registration OTP
// ════════════════════════════════════════════════════════════
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const cleanEmail = email.toLowerCase().trim();
    const stored     = registerOtpStore.get(cleanEmail);

    console.log(`Register OTP check — stored: ${stored?.otp}, provided: ${otp}`);

    if (!stored)
      return res.status(400).json({ message: "No code found. Please request a new one." });

    if (new Date(stored.expiresAt) < new Date()) {
      registerOtpStore.delete(cleanEmail);
      return res.status(400).json({ message: "Code expired. Please request a new one." });
    }

    if (String(stored.otp).trim() !== String(otp).trim())
      return res.status(400).json({ message: "Incorrect code. Please try again." });

    stored.verified = true;
    registerOtpStore.set(cleanEmail, stored);

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("VERIFY REGISTER OTP:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  STEP C — Register (only after OTP verified)
// ════════════════════════════════════════════════════════════
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const cleanEmail = email.toLowerCase().trim();

    // ✅ Enforce OTP verification before account creation
    const otpRecord = registerOtpStore.get(cleanEmail);
    if (!otpRecord || !otpRecord.verified)
      return res.status(400).json({ message: "Please verify your email before registering." });

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(400).json({ message: "An account with this email already exists" });

    const safeRole = ["user", "recruiter"].includes(role) ? role : "user";

    const user = await User.create({
      name:     name.trim(),
      email:    cleanEmail,
      password: await bcrypt.hash(password, 12),
      role:     safeRole,
    });

    registerOtpStore.delete(cleanEmail); // cleanup

    return res.status(201).json({
      message: "Registration successful",
      token:   generateToken(user._id),
      user:    userResponse(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error.code === 11000)
      return res.status(400).json({ message: "An account with this email already exists" });
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ════════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════════
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    return res.status(200).json({
      message: "Login successful",
      token:   generateToken(user._id),
      user:    userResponse(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ════════════════════════════════════════════════════════════
//  GET ME
// ════════════════════════════════════════════════════════════
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  UPDATE PROFILE
// ════════════════════════════════════════════════════════════
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio, title, linkedin, github, skills } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email.toLowerCase().trim() !== user.email) {
      const taken = await User.findOne({ email: email.toLowerCase().trim() });
      if (taken) return res.status(400).json({ message: "Email already in use" });
      user.email = email.toLowerCase().trim();
    }

    if (name     !== undefined) user.name     = name.trim();
    if (phone    !== undefined) user.phone    = phone    ? phone.trim()    : "";
    if (location !== undefined) user.location = location ? location.trim() : "";
    if (bio      !== undefined) user.bio      = bio      ? bio.trim()      : "";
    if (title    !== undefined) user.title    = title    ? title.trim()    : "";
    if (linkedin !== undefined) user.linkedin = linkedin ? linkedin.trim() : "";
    if (github   !== undefined) user.github   = github   ? github.trim()   : "";
    if (Array.isArray(skills))  user.skills   = skills;

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  CHANGE PASSWORD
// ════════════════════════════════════════════════════════════
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Please fill all fields" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    if (oldPassword === newPassword)
      return res.status(400).json({ message: "New password must be different" });

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  LOGOUT
// ════════════════════════════════════════════════════════════
exports.logoutUser = (req, res) =>
  res.status(200).json({ message: "Logged out successfully" });

// ════════════════════════════════════════════════════════════
//  FORGOT PASSWORD — Step 1: Send OTP
// ════════════════════════════════════════════════════════════
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user)
      return res.status(200).json({ message: "If this email is registered, a reset code has been sent." });

    await sendOtp(user, "forgot-password");
    return res.status(200).json({ message: "Reset code sent to your email." });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Failed to send reset email. Please try again." });
  }
};

// ════════════════════════════════════════════════════════════
//  VERIFY OTP — Step 2 (forgot password)
// ════════════════════════════════════════════════════════════
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(400).json({ message: "No account found with this email" });

    const result = await checkOtp(user._id, otp);
    if (!result.valid)
      return res.status(400).json({ message: result.reason });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  RESET PASSWORD — Step 3
// ════════════════════════════════════════════════════════════
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(400).json({ message: "No account found with this email" });

    const result = await checkOtp(user._id, otp);
    if (!result.valid)
      return res.status(400).json({ message: result.reason });

    // Run these in parallel for speed
    const [freshUser] = await Promise.all([
      User.findById(user._id),
      clearOtp(user._id),
    ]);

    freshUser.password = await bcrypt.hash(newPassword, 12);
    await freshUser.save();

    return res.status(200).json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};