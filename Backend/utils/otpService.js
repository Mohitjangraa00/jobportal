const nodemailer = require("nodemailer");

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const buildEmail = (userName, otp, purpose) => ({
  subject: purpose === "register"
    ? "Welcome to JobPortal — Verify your email"
    : "JobPortal — Your Password Reset Code",
  html: `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:32px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;">
      <h2 style="color:#0f2027;margin-bottom:12px;">
        ${purpose === "register" ? "Verify your email" : "Reset your password"}
      </h2>
      <p style="color:#64748b;margin-bottom:24px;line-height:1.6;">
        Hi <strong>${userName || "there"}</strong>,
        ${purpose === "register"
          ? " welcome to JobPortal! Use the code below to verify your email."
          : " use the code below to reset your password. It expires in 10 minutes."}
      </p>
      <div style="background:#f8fafc;border:2px dashed #6366f1;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;">Your 6-digit code</p>
        <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#0f2027;font-family:monospace;">${otp}</span>
      </div>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:#92400e;">⏰ Expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. Do not share this code.</p>
      </div>
      <p style="margin:0;font-size:12px;color:#94a3b8;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `,
});

// ─── Send OTP ────────────────────────────────────────────────
// ✅ Uses User.findByIdAndUpdate to bypass any select:false issues
const sendOtp = async (user, purpose = "forgot-password") => {
  const User = require("../models/User"); // lazy require to avoid circular deps

  const otp       = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // ✅ Use findByIdAndUpdate — bypasses select:false completely
  await User.findByIdAndUpdate(user._id, {
    "resetOtp.code":      otp,
    "resetOtp.expiresAt": expiresAt,
  });

  // Always log OTP in development for easy testing
  console.log(`\n🔑 OTP for ${user.email}: ${otp}  (expires in ${OTP_EXPIRY_MINUTES}m)\n`);

  // Send email (non-fatal in development)
  try {
    const { subject, html } = buildEmail(user.name, otp, purpose);
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"JobPortal" <${process.env.EMAIL_USER}>`,
      to:   user.email,
      subject,
      html,
    });
  } catch (emailErr) {
    if (process.env.NODE_ENV === "production") throw emailErr;
    console.warn("⚠️  Email not sent (check EMAIL_USER/EMAIL_PASS in .env):", emailErr.message);
  }

  return otp;
};

// ─── Verify OTP ──────────────────────────────────────────────
// ✅ Fetches fresh from DB to avoid any caching/select issues
const verifyOtp = async (userId, inputOtp) => {
  const User = require("../models/User");

  // Fetch directly with only the fields we need — no select:false concerns
  const user = await User.findById(userId).select("resetOtp");

  console.log("Verifying OTP — stored:", user?.resetOtp?.code, "| provided:", inputOtp);

  if (!user?.resetOtp?.code) {
    return { valid: false, reason: "No reset code found. Please request a new one." };
  }

  if (new Date(user.resetOtp.expiresAt) < new Date()) {
    return { valid: false, reason: "Reset code has expired. Please request a new one." };
  }

  if (String(user.resetOtp.code).trim() !== String(inputOtp).trim()) {
    return { valid: false, reason: "Incorrect reset code. Please check and try again." };
  }

  return { valid: true };
};

// ─── Clear OTP after use ─────────────────────────────────────
const clearOtp = async (userId) => {
  const User = require("../models/User");
  await User.findByIdAndUpdate(userId, {
    "resetOtp.code":      null,
    "resetOtp.expiresAt": null,
  });
};

module.exports = { sendOtp, verifyOtp, clearOtp, generateOtp };