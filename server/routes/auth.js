const express = require('express');
const db = require('../../config/db');

const router = express.Router();


router.post('/signup', (req, res) => {
  const { name, email, password, age, height } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, and password are required' });
  }

  const sql =
    'INSERT INTO users (name, email, password, age, height) VALUES (?, ?, ?, ?, ?)';

  db.query(
    sql,
    [name, email, password, age || null, height || null],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      req.session.user = {
        user_id: result.insertId,
        name,
        email,
        age: age || null,
        height: height || null,
      };

      res.json({ user: req.session.user });
    }
  );
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql =
    'SELECT user_id, name, email, age, height FROM users WHERE email = ? AND password = ? LIMIT 1';

  db.query(sql, [email, password], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    req.session.user = rows[0];
    res.json({ user: req.session.user });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get('/me', (req, res) => {
  res.json({ user: req.session.user || null });
});

module.exports = router;

