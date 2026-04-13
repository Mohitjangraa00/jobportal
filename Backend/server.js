require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// 🔐 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 📌 Import Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// 📌 Import Error Middleware
const { errorMiddleware, notFound } = require("./middleware/errorMiddleware");

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// 📌 Root Route
app.get("/", (req, res) => {
  res.send("🚀 Job Portal API is running...");
});

// ❌ Handle 404
app.use(notFound);

// 🔴 Global Error Handler
app.use(errorMiddleware);

// 📌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server after DB connection
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🚀 Server running on port ${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
  });