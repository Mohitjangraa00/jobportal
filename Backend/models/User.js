const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Please enter your name"],
      trim:     true,
    },

    email: {
      type:      String,
      required:  [true, "Please enter your email"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    password: {
      type:      String,
      required:  [true, "Please enter your password"],
      minlength: 6,
      select:    false, // only password is hidden
    },

    role: {
      type:    String,
      enum:    ["user", "recruiter", "admin"],
      default: "user",
    },

    phone:      { type: String, default: "" },
    location:   { type: String, default: "" },
    bio:        { type: String, default: "" },
    title:      { type: String, default: "" },
    profilePic: { type: String, default: "" },
    resume:     { type: String, default: "" },
    skills:     [{ type: String }],
    linkedin:   { type: String, default: "" },
    github:     { type: String, default: "" },

    // ✅ CRITICAL FIX: NO select:false on resetOtp
    // select:false on nested fields causes them to be undefined
    // even after .save() — leading to "No reset code found" error
    resetOtp: {
      code:      { type: String, default: null },
      expiresAt: { type: Date,   default: null },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);