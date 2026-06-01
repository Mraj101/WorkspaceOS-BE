/**
 * expense-tracker/queries.js
 *
 * ALL database access for the expense-tracker module lives here.
 * No other module should touch these tables.
 *
 * Uses raw SQL via the shared pg Pool.
 * Complex queries (JOINs, aggregates) are written explicitly here —
 * queryHelpers are used only for simple CRUD where possible.
 */
const pool = require('../../config/db');

const EXPENSES_TABLE   = 'expense_tracker_expenses';
const CATEGORIES_TABLE = 'expense_tracker_categories';

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const getAllCategories = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM ${CATEGORIES_TABLE} ORDER BY name ASC`
  );
  return rows;
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${CATEGORIES_TABLE} WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

const createCategory = async ({ name, icon, color }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${CATEGORIES_TABLE} (name, icon, color)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, icon ?? null, color ?? '#6B7280']
  );
  return rows[0];
};

const deleteCategoryById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${CATEGORIES_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

/**
 * List expenses with optional filters.
 * Supports: category_id, date range (from/to), pagination (limit/offset).
 */
const getExpenses = async ({ category_id, from, to, limit = 50, offset = 0 } = {}) => {
  const conditions = [];
  const params     = [];

  if (category_id) {
    params.push(category_id);
    conditions.push(`e.category_id = $${params.length}`);
  }
  if (from) {
    params.push(from);
    conditions.push(`e.spent_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`e.spent_at <= $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // JOIN with categories so callers get category name + icon in one call
  const { rows } = await pool.query(
    `SELECT
       e.*,
       c.name  AS category_name,
       c.icon  AS category_icon,
       c.color AS category_color
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     ${where}
     ORDER BY e.spent_at DESC, e.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const getExpenseById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       e.*,
       c.name  AS category_name,
       c.icon  AS category_icon,
       c.color AS category_color
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE e.id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

const createExpense = async ({ title, amount, category_id, note, spent_at }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${EXPENSES_TABLE} (title, amount, category_id, note, spent_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, amount, category_id ?? null, note ?? null, spent_at ?? new Date()]
  );
  return rows[0];
};

const updateExpense = async (id, { title, amount, category_id, note, spent_at }) => {
  // Build dynamic SET clause — only update provided fields
  const fields  = [];
  const params  = [];

  if (title       !== undefined) { params.push(title);       fields.push(`title = $${params.length}`); }
  if (amount      !== undefined) { params.push(amount);      fields.push(`amount = $${params.length}`); }
  if (category_id !== undefined) { params.push(category_id); fields.push(`category_id = $${params.length}`); }
  if (note        !== undefined) { params.push(note);        fields.push(`note = $${params.length}`); }
  if (spent_at    !== undefined) { params.push(spent_at);    fields.push(`spent_at = $${params.length}`); }

  if (fields.length === 0) return null; // nothing to update

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE ${EXPENSES_TABLE}
     SET ${fields.join(', ')}
     WHERE id = $${params.length}
     RETURNING *`,
    params
  );
  return rows[0] ?? null;
};

const deleteExpenseById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${EXPENSES_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

/**
 * Summary: total amount spent per category.
 * Optionally filter by date range.
 */
const getExpenseSummary = async ({ from, to } = {}) => {
  const conditions = ['1=1'];
  const params     = [];

  if (from) { params.push(from); conditions.push(`e.spent_at >= $${params.length}`); }
  if (to)   { params.push(to);   conditions.push(`e.spent_at <= $${params.length}`); }

  const { rows } = await pool.query(
    `SELECT
       COALESCE(c.name, 'Uncategorized') AS category,
       c.icon,
       c.color,
       COUNT(e.id)          AS expense_count,
       SUM(e.amount)        AS total_amount
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE ${conditions.join(' AND ')}
     GROUP BY c.name, c.icon, c.color
     ORDER BY total_amount DESC`,
    params
  );
  return rows;
};

module.exports = {
  // categories
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
  // expenses
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpenseById,
  getExpenseSummary,
};
