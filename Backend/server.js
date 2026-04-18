require("dotenv").config();

const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));           // 10mb to support base64 profile pics
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
const authRoutes        = require("./routes/authRoutes");
const jobRoutes         = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/auth",         authRoutes);
app.use("/api/jobs",         jobRoutes);
app.use("/api/applications", applicationRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/",          (req, res) => res.json({ message: "🚀 JobPortal API is running" }));
app.get("/api/health",(req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// ── Error handling ────────────────────────────────────────────
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorMiddleware);

// ── Connect DB and start server ───────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });