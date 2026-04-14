const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const db = require("./config/db");

const authRoutes = require("./server/routes/auth");
const profileRoutes = require("./server/routes/profile");
const logsRoutes = require("./server/routes/logs");

const app = express();

app.use(express.json());
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow tools like Postman / curl (no Origin header)
      if (!origin) return callback(null, true);

      // Allow Vite dev server ports (5173, 5174, 5175, ...)
      if (origin.startsWith("http://localhost:517")) return callback(null, true);

      // Allow anything explicitly listed in CLIENT_ORIGIN
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.get("/api/health", (req, res) => {
  db.query("SELECT 1 AS ok", (err) => {
    if (err) return res.status(500).json({ ok: false, db: "down" });
    res.json({ ok: true, db: "up" });
  });
});

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", logsRoutes);

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

