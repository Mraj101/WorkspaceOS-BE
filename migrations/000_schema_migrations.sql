-- ============================================================
-- Schema Migrations Table
-- Migration: 000_schema_migrations.sql
--
-- Tracks which migration files have been applied to this database.
-- This file must be run ONCE manually before any other migration.
-- After this, use `npm run migrate` to apply all pending migrations.
-- ============================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  version    VARCHAR(255) PRIMARY KEY,   -- the filename, e.g. "001_expense_tracker_init.sql"
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
