const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter job title"],
    },

    description: {
      type: String,
      required: [true, "Please enter job description"],
    },

    company: {
      type: String,
      required: [true, "Please enter company name"],
    },

    location: {
      type: String,
      required: [true, "Please enter location"],
    },

    salary: {
      type: Number,
      required: [true, "Please enter salary"],
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote"],
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    deadline: {
      type: Date,
    },

    companyLogo: {
      type: String, // URL
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);