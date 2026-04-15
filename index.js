const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const db = require('./config/db');

const authRoutes = require('./server/routes/auth');
const requireAuth = require('./server/middleware/requireAuth');

const app = express();
const PORT = Number(process.env.PORT || 9000);

app.use(
  cors({
    // allow Vite ports (5173, 5174, 5175...) + anything in CLIENT_ORIGIN
    origin(origin, callback) {
      const allowedOrigins = String(process.env.CLIENT_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (!origin) return callback(null, true);
      if (origin.startsWith('http://localhost:517')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    name: 'gymlogger.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true behind HTTPS
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  }),
);

app.get('/health', (req, res) => {
  db.query('SELECT 1 AS ok', (err) => {
    if (err) return res.status(500).json({ ok: false, db: 'down' });
    return res.status(200).json({ ok: true, db: 'up' });
  });
});

// Routes (no /api prefix, beginner simple)
app.use('/auth', authRoutes); // /auth/login, /auth/signup, /auth/logout, /auth/me

// ===== Profile (moved here from server/routes/profile.js) =====

// Get current profile (from session)
app.get('/profile', requireAuth, (req, res) => {
  return res.json({ user: req.session.user });
});

// Update profile + update active session user
app.put('/profile', requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { name, email, age, height } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?, age = ?, height = ?
    WHERE user_id = ?
  `;

  db.query(sql, [name, email, age || null, height || null, userId], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    // Keep session in sync so UI updates immediately
    req.session.user = {
      ...req.session.user,
      name,
      email,
      age: age || null,
      height: height || null,
    };

    return res.json({ user: req.session.user });
  });
});

// ===== Logs / History (moved here from server/routes/logs.js) =====

// List exercises for the workout form
app.get('/exercises', requireAuth, (req, res) => {
  db.query('SELECT exercise_id, name, description FROM exercises', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    return res.json({ exercises: rows });
  });
});

// Log daily weight
app.post('/weight-logs', requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { weight, log_date } = req.body;

  if (!weight || !log_date) {
    return res.status(400).json({ error: 'weight and log_date are required' });
  }

  const sql = 'INSERT INTO weight_logs (user_id, weight, log_date) VALUES (?, ?, ?)';

  db.query(sql, [userId, weight, log_date], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    return res.json({
      weight_log: { weight_id: result.insertId, user_id: userId, weight, log_date },
    });
  });
});

// Log a workout
app.post('/workout-logs', requireAuth, (req, res) => {
  const userId = req.session.user.user_id;
  const { exercise_id, sets, reps, duration, log_date, notes } = req.body;

  if (!exercise_id || !log_date) {
    return res.status(400).json({ error: 'exercise_id and log_date are required' });
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
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.json({
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
    },
  );
});

// History: a single table (weight + workout), newest first
app.get('/history', requireAuth, (req, res) => {
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
    if (err) return res.status(500).json({ error: 'Database error' });
    return res.json({ history: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

