-- ============================================================
-- Workspace — Expense Tracker: budgets
-- Migration: 002_budgets.sql
-- ============================================================

-- A budget is a single pot: a name, an amount, and a fixed window. It does
-- NOT carry a category — "what was it spent on" is a tag on the expense
-- (expense_tracker_categories), not a split of the pot itself. One budget
-- covers all spending in its window; what's left is computed by summing its
-- expenses at read time (amount - SUM(expenses.amount)), never stored here.
CREATE TABLE IF NOT EXISTS expense_tracker_budgets (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  amount     NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT expense_tracker_budgets_dates_check
    CHECK (end_date > start_date)
);

CREATE TRIGGER set_updated_at_budgets
  BEFORE UPDATE ON expense_tracker_budgets
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
