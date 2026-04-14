const mysql = require("mysql2");

// Connection pool = more stable than a single connection.
// Uses env vars so it's easy to fix DB credentials without editing code.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "gym_logger",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick startup check (does NOT crash the server).
pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("MySQL not connected:", err.code || err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = pool;
