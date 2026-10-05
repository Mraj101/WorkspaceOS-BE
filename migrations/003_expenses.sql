-- ============================================================
-- Workspace — Expense Tracker: expenses
-- Migration: 003_expenses.sql
-- ============================================================

-- An expense draws from exactly one budget, or none (budget_id NULL = not
-- covered by any pot — still recorded, never rejected). It also carries its
-- own category as a tag, independent of any budget: that's what makes "where
-- did it go" answerable even for unbudgeted spending, and lets one budget
-- hold expenses tagged with several different categories.
CREATE TABLE IF NOT EXISTS expense_tracker_expenses (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  budget_id   INTEGER REFERENCES expense_tracker_budgets(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES expense_tracker_categories(id) ON DELETE RESTRICT,
  title       VARCHAR(255) NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  note        TEXT,
  spent_at    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE TRIGGER set_updated_at_expenses
  BEFORE UPDATE ON expense_tracker_expenses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
