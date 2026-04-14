const express = require("express");
const db = require("../../config/db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Get current profile (from session)
router.get("/profile", requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Update profile + update active session user
router.put("/profile", requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { name, email, age, height } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?, age = ?, height = ?
    WHERE user_id = ?
  `;

  db.query(sql, [name, email, age || null, height || null, userId], (err) => {
    if (err) {
      // Most common beginner error: duplicate email
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Database error" });
    }

    // Keep session in sync so UI updates immediately
    req.session.user = {
      ...req.session.user,
      name,
      email,
      age: age || null,
      height: height || null,
    };

    res.json({ user: req.session.user });
  });
});

module.exports = router;

