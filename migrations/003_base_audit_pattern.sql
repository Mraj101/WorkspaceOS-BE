-- ============================================================
-- Workspace — Base Audit Pattern
-- Migration: 003_base_audit_pattern.sql
--
-- Establishes a common audit field pattern (Base Entity) for all tables:
-- id, created_at, updated_at, deleted_at.
-- Implements automatic updated_at handling using a generic trigger.
-- ============================================================

-- 1. Create a generic trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create a utility procedure to apply the base entity fields to any table
CREATE OR REPLACE PROCEDURE apply_base_entity(target_table text)
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()', target_table);
  EXECUTE format('ALTER TABLE %I ALTER COLUMN created_at SET DEFAULT NOW()', target_table);
  EXECUTE format('UPDATE %I SET created_at = NOW() WHERE created_at IS NULL', target_table);
  EXECUTE format('ALTER TABLE %I ALTER COLUMN created_at SET NOT NULL', target_table);
  
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()', target_table);
  EXECUTE format('ALTER TABLE %I ALTER COLUMN updated_at SET DEFAULT NOW()', target_table);
  EXECUTE format('UPDATE %I SET updated_at = NOW() WHERE updated_at IS NULL', target_table);
  EXECUTE format('ALTER TABLE %I ALTER COLUMN updated_at SET NOT NULL', target_table);
  
  -- deleted_at
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ', target_table);

  -- Drop existing trigger if it exists to avoid duplicates
  EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', target_table);

  -- Create the trigger
  EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()', target_table);
END;
$$;

-- 3. Fix junction table to conform to Base Entity pattern
-- We add a surrogate primary key (id) to junction tables so they share the exact same shape
ALTER TABLE expense_tracker_expense_tags DROP CONSTRAINT IF EXISTS expense_tracker_expense_tags_pkey;
ALTER TABLE expense_tracker_expense_tags ADD COLUMN IF NOT EXISTS id SERIAL PRIMARY KEY;

-- Restore uniqueness constraint previously covered by the composite primary key
-- We add it only if it doesn't exist, by trying to create an index
-- Wait, safer to just add a unique constraint explicitly
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'expense_tracker_expense_tags_expense_id_tag_id_key'
  ) THEN
    ALTER TABLE expense_tracker_expense_tags ADD CONSTRAINT expense_tracker_expense_tags_expense_id_tag_id_key UNIQUE (expense_id, tag_id);
  END IF;
END $$;

-- 4. Apply the Base Entity pattern to all existing tables
CALL apply_base_entity('expense_tracker_categories');
CALL apply_base_entity('expense_tracker_expenses');
CALL apply_base_entity('expense_tracker_payment_methods');
CALL apply_base_entity('expense_tracker_tags');
CALL apply_base_entity('expense_tracker_expense_tags');
