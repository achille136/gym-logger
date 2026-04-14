# Gym Membership & Workout Logger (Group 9)

## What you have now

- **MySQL database**: `database.sql`
- **Express API (session login + Edit Profile)**: `index.js`
- **React app (Login + Edit Profile UI)**: `client/`

## 1) Setup MySQL

1. Start your MySQL server (ex: **XAMPP MySQL** or **MySQL80** service).
2. Run your SQL file:
   - Open MySQL Workbench / phpMyAdmin
   - Run `database.sql`

### If you get a database error

If the backend shows `ECONNREFUSED 127.0.0.1:3306`, it means **MySQL is not running** (or it's running on a different port).

- Start MySQL
- Confirm the port (usually `3306`)
- If your MySQL username/password is not `root`/empty, create a `.env` file (copy from `.env.example`) and change:
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_PORT` (if needed)

Create a demo user (so you can login):

```sql
USE gym_logger;
INSERT INTO users (name, email, password, age, height)
VALUES ('Achille', 'achille@test.com', '1234', 20, 175.0);
```

Or just use the **Signup** tab in the React app (it creates the user and auto-logs in).

## 2) Run the backend (Express)

From the project root:

```bash
npm run dev
```

API runs at `http://localhost:3001`.

## 3) Run the frontend (React)

In another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## How Edit Profile works (simple)

- React calls **PUT** `/api/profile`
- Express updates the **users** table
- Express also updates `req.session.user`
- React sets its local `user` state from the response

