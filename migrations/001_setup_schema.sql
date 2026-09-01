-- ============================================================
-- Workspace — Consolidated Expense Tracker Schema
-- Migration: 001_setup_schema.sql
-- ============================================================

-- 1. Create set_updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Categories table
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

-- 3. Payment Methods table
CREATE TABLE IF NOT EXISTS expense_tracker_payment_methods (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  icon       VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_payment_methods
  BEFORE UPDATE ON expense_tracker_payment_methods
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 4. Expenses table
CREATE TABLE IF NOT EXISTS expense_tracker_expenses (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  amount         NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category_id    INTEGER REFERENCES expense_tracker_categories(id) ON DELETE SET NULL,
  note           TEXT,
  spent_at       DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50) DEFAULT 'cash',
  is_recurring   BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_expenses
  BEFORE UPDATE ON expense_tracker_expenses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_et_expenses_category_id ON expense_tracker_expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_et_expenses_spent_at    ON expense_tracker_expenses(spent_at DESC);
CREATE INDEX IF NOT EXISTS idx_et_expenses_updated_at  ON expense_tracker_expenses(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_et_expenses_payment_method ON expense_tracker_expenses(payment_method);

-- 5. Tags table
CREATE TABLE IF NOT EXISTS expense_tracker_tags (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL UNIQUE,
  color      VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_tags
  BEFORE UPDATE ON expense_tracker_tags
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 6. Expense ↔ Tags junction table
CREATE TABLE IF NOT EXISTS expense_tracker_expense_tags (
  id         SERIAL PRIMARY KEY,
  expense_id INTEGER REFERENCES expense_tracker_expenses(id) ON DELETE CASCADE,
  tag_id     INTEGER REFERENCES expense_tracker_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT expense_tracker_expense_tags_expense_id_tag_id_key UNIQUE (expense_id, tag_id)
);

CREATE TRIGGER set_updated_at_expense_tags
  BEFORE UPDATE ON expense_tracker_expense_tags
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_et_expense_tags_tag_id ON expense_tracker_expense_tags(tag_id);

-- 7. Seed default categories
INSERT INTO expense_tracker_categories (name, icon, color) VALUES
  ('Food',          '🍕', '#FF6B6B'),
  ('Transport',     '🚗', '#4ECDC4'),
  ('Health',        '🏥', '#45B7D1'),
  ('Entertainment', '🎮', '#96CEB4'),
  ('Shopping',      '🛍️',  '#FFEAA7'),
  ('Utilities',     '💡', '#DDA0DD'),
  ('Other',         '📦', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- 8. Seed default payment methods
INSERT INTO expense_tracker_payment_methods (name, icon) VALUES
  ('Cash',          '💵'),
  ('Credit Card',   '💳'),
  ('Debit Card',    '💳'),
  ('Bank Transfer', '🏦'),
  ('Mobile Pay',    '📱')
ON CONFLICT (name) DO NOTHING;

-- 9. Seed example tags
INSERT INTO expense_tracker_tags (name, color) VALUES
  ('Work',       '#3B82F6'),
  ('Personal',   '#EF4444'),
  ('Urgent',     '#F59E0B'),
  ('Reimbursable','#10B981')
ON CONFLICT (name) DO NOTHING;
