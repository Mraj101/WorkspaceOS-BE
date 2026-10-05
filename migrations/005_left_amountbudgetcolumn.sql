-- migrations/XXXX_add_left_amount_to_budgets.sql

-- UP
BEGIN;

ALTER TABLE expense_tracker_budgets
  ADD COLUMN IF NOT EXISTS left_amount numeric(12,2);

UPDATE expense_tracker_budgets b
SET left_amount = b.budget_amount - COALESCE((
  SELECT SUM(e.expense_amount)
  FROM expense_tracker_expenses e
  WHERE e.budget_id = b.id
    AND e.deleted_at IS NULL
), 0)
WHERE b.left_amount IS NULL;

ALTER TABLE expense_tracker_budgets
  ALTER COLUMN left_amount SET NOT NULL;

COMMIT;

-- DOWN
-- ALTER TABLE expense_tracker_budgets DROP COLUMN IF EXISTS left_amount;