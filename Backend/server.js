require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://jobportal-6jxf.vercel.app",
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const ok = allowedOrigins.some(o => typeof o === "string" ? o === origin : o.test(origin));
    if (ok) return callback(null, true);
    console.warn("CORS blocked:", origin);
    callback(new Error("CORS not allowed: " + origin));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/jobs",         require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

app.get("/",           (_, res) => res.json({ message: "JobPortal API running" }));
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");
app.use(notFound);
app.use(errorMiddleware);

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("✅ MongoDB Connected"); app.listen(process.env.PORT||5000, () => console.log("🚀 Server on port", process.env.PORT||5000)); })
  .catch(err => { console.error("❌ DB Error:", err.message); process.exit(1); });