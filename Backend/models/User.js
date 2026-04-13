const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 6,
      select: false, // 🔐 hide password by default
    },

    role: {
      type: String,
      enum: ["user", "admin", "recruiter"],
      default: "user",
    },

    profilePic: {
      type: String, // URL (Cloudinary or local)
      default: "",
    },

    resume: {
      type: String, // resume URL
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);