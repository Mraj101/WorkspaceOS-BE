-- ============================================================
-- Workspace — Expense Tracker: users & categories
-- Migration: 001_setup_schema.sql
-- ============================================================

-- Shared trigger: every table below keeps its own updated_at current.
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Users table
-- Deliberately minimal and NOT prefixed: users are platform-level, not owned
-- by the expense tracker module. Credentials are the auth module's business,
-- so there is no password column here yet.
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  name       VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Seed the development user so ownership FKs resolve before auth exists.
INSERT INTO users (id, email, name) VALUES
  (1, 'dev@localhost', 'Dev User')
ON CONFLICT (email) DO NOTHING;

-- Keep the sequence ahead of the explicit id above, or the first real signup
-- would collide on id = 1.
SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM users), 1));

-- 2. Categories table
-- Global reference data, shared by every user — a tag on an expense, nothing
-- more. Budgets do not reference this table; see 002_budgets.sql.
CREATE TABLE IF NOT EXISTS expense_tracker_categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(10),                          -- emoji: 🍕 🚗 🏥
  color      VARCHAR(7) NOT NULL DEFAULT '#6B7280', -- hex color for UI
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON expense_tracker_categories
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Seed default categories
INSERT INTO expense_tracker_categories (name, icon, color) VALUES
  ('Food',          '🍕', '#FF6B6B'),
  ('Transport',     '🚗', '#4ECDC4'),
  ('Health',        '🏥', '#45B7D1'),
  ('Entertainment', '🎮', '#96CEB4'),
  ('Shopping',      '🛍️',  '#FFEAA7'),
  ('Utilities',     '💡', '#DDA0DD'),
  ('Other',         '📦', '#6B7280')
ON CONFLICT (name) DO NOTHING;
