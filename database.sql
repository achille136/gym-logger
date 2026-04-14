-- Create Database
CREATE DATABASE IF NOT EXISTS gym_logger;
USE gym_logger;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    height DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================
-- EXERCISES TABLE
-- =========================
CREATE TABLE exercises (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- =========================
-- WEIGHT LOGS TABLE
-- =========================
CREATE TABLE weight_logs (
    weight_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE CASCADE
);

-- =========================
-- WORKOUT LOGS TABLE
-- =========================
CREATE TABLE workout_logs (
    workout_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT,
    reps INT,
    duration INT, -- in minutes
    log_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) 
    REFERENCES users(user_id) 
    ON DELETE CASCADE,

    FOREIGN KEY (exercise_id) 
    REFERENCES exercises(exercise_id) 
    ON DELETE CASCADE
);

-- =========================
-- OPTIONAL: INSERT DEFAULT EXERCISES
-- =========================
INSERT INTO exercises (name, description) VALUES
('Push-ups', 'Upper body exercise'),
('Squats', 'Leg strength exercise'),
('Running', 'Cardio exercise'),
('Plank', 'Core strength exercise');
