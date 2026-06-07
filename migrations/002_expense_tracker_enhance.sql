-- ============================================================
-- Workspace — Expense Tracker Schema Enhancement
-- Migration: 002_expense_tracker_enhance.sql
--
-- Adds: payment methods, tags (many-to-many), updated_at,
--       is_recurring flag, and supporting indexes.
--
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT DO NOTHING).
-- ============================================================

-- ─── New columns on existing expenses table ──────────────────────────────────
ALTER TABLE expense_tracker_expenses
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash';

ALTER TABLE expense_tracker_expenses
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;

ALTER TABLE expense_tracker_expenses
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- ─── Payment methods reference table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_tracker_payment_methods (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  icon       VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Tags table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_tracker_tags (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  color      VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Expense ↔ Tags junction table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_tracker_expense_tags (
  expense_id INTEGER REFERENCES expense_tracker_expenses(id) ON DELETE CASCADE,
  tag_id     INTEGER REFERENCES expense_tracker_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (expense_id, tag_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_et_expenses_updated_at
  ON expense_tracker_expenses(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_et_expenses_payment_method
  ON expense_tracker_expenses(payment_method);

CREATE INDEX IF NOT EXISTS idx_et_expense_tags_tag_id
  ON expense_tracker_expense_tags(tag_id);

-- ─── Seed default payment methods ────────────────────────────────────────────
INSERT INTO expense_tracker_payment_methods (name, icon) VALUES
  ('Cash',          '💵'),
  ('Credit Card',   '💳'),
  ('Debit Card',    '💳'),
  ('Bank Transfer', '🏦'),
  ('Mobile Pay',    '📱')
ON CONFLICT (name) DO NOTHING;

-- ─── Seed example tags ──────────────────────────────────────────────────────
INSERT INTO expense_tracker_tags (name, color) VALUES
  ('Work',       '#3B82F6'),
  ('Personal',   '#EF4444'),
  ('Urgent',     '#F59E0B'),
  ('Reimbursable','#10B981')
ON CONFLICT (name) DO NOTHING;
