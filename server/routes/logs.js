const express = require("express");
const db = require("../../config/db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// List exercises for the workout form
router.get("/exercises", requireAuth, (req, res) => {
  db.query("SELECT exercise_id, name, description FROM exercises", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ exercises: rows });
  });
});

// Log daily weight
router.post("/weight-logs", requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { weight, log_date } = req.body;

  if (!weight || !log_date) {
    return res.status(400).json({ error: "weight and log_date are required" });
  }

  const sql =
    "INSERT INTO weight_logs (user_id, weight, log_date) VALUES (?, ?, ?)";

  db.query(sql, [userId, weight, log_date], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({
      weight_log: { weight_id: result.insertId, user_id: userId, weight, log_date },
    });
  });
});

// Log a workout
router.post("/workout-logs", requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { exercise_id, sets, reps, duration, log_date, notes } = req.body;

  if (!exercise_id || !log_date) {
    return res.status(400).json({ error: "exercise_id and log_date are required" });
  }

  const sql = `
    INSERT INTO workout_logs
      (user_id, exercise_id, sets, reps, duration, log_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      exercise_id,
      sets || null,
      reps || null,
      duration || null,
      log_date,
      notes || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({
        workout_log: {
          workout_id: result.insertId,
          user_id: userId,
          exercise_id,
          sets: sets || null,
          reps: reps || null,
          duration: duration || null,
          log_date,
          notes: notes || null,
        },
      });
    }
  );
});

// History: a single table (weight + workout), newest first
router.get("/history", requireAuth, (req, res) => {
  const userId = req.session.user.user_id;

  const sql = `
    SELECT
      'weight' AS type,
      wl.weight_id AS id,
      wl.log_date,
      wl.weight,
      NULL AS exercise_name,
      NULL AS sets,
      NULL AS reps,
      NULL AS duration,
      NULL AS notes
    FROM weight_logs wl
    WHERE wl.user_id = ?

    UNION ALL

    SELECT
      'workout' AS type,
      w.workout_id AS id,
      w.log_date,
      NULL AS weight,
      e.name AS exercise_name,
      w.sets,
      w.reps,
      w.duration,
      w.notes
    FROM workout_logs w
    JOIN exercises e ON e.exercise_id = w.exercise_id
    WHERE w.user_id = ?

    ORDER BY log_date DESC, type ASC, id DESC
    LIMIT 200
  `;

  db.query(sql, [userId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ history: rows });
  });
});

module.exports = router;

