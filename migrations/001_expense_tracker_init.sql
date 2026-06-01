-- ============================================================
-- Workspace — Expense Tracker Schema
-- Migration: 001_expense_tracker_init.sql
--
-- Run once to set up the expense tracker tables.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- ============================================================

-- Categories table
CREATE TABLE IF NOT EXISTS expense_tracker_categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(10),                          -- emoji: 🍕 🚗 🏥
  color      VARCHAR(7) NOT NULL DEFAULT '#6B7280', -- hex color for UI
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expense_tracker_expenses (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0), -- never FLOAT for money
  category_id INTEGER REFERENCES expense_tracker_categories(id) ON DELETE SET NULL,
  note        TEXT,
  spent_at    DATE NOT NULL DEFAULT CURRENT_DATE,  -- calendar date, not a timestamp
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_et_expenses_category_id ON expense_tracker_expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_et_expenses_spent_at    ON expense_tracker_expenses(spent_at DESC);

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
