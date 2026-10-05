const pool = require('../../../config/db');

const BaseEntity = require('../../../lib/BaseEntity');

const EXPENSES_TABLE = 'expense_tracker_expenses';
const BUDGETS_TABLE = 'expense_tracker_budgets';


const CATEGORIES_TABLE = 'expense_tracker_categories';
const expensesEntity = new BaseEntity(EXPENSES_TABLE);

const createExpense = async (userId, data) => {
  // We can pass data directly; BaseEntity strips audit fields internally.
  // user_id comes from the authenticated caller, never from the request body.
  return await expensesEntity.create({
    user_id: userId,
    budget_id: data.budget_id ?? null,
    title: data.title,
    amount: data.amount,
    category_id: data.category_id ?? null,
    note: data.note ?? null,
    spent_at: data.spent_at ?? new Date(),
  });
};

/**
 * Categories are global reference data today, so existence is owner-independent.
 * When per-user categories land this takes a userId and asks whether the
 * category is *visible to that caller* (own rows + system defaults).
 */
const categoryExists = async (categoryId) => {
  const { rows } = await pool.query(
    `SELECT 1 FROM ${CATEGORIES_TABLE} WHERE id = $1 AND deleted_at IS NULL`,
    [categoryId]
  );
  return rows.length > 0;
};

/**
 * Finds the one budget of the caller's that an expense draws from: the budget
 * whose window contains spent_at. A budget has no category, so this is a
 * plain date lookup — the create-time overlap rule guarantees at most one
 * budget can ever cover a given date, so this is deterministic. Returns null
 * when nothing covers the expense — unbudgeted spending is still recorded.
 */
const findCoveringBudget = async (userId, { spent_at }) => {
  const { rows } = await pool.query(
    `SELECT id, name, amount, start_date, end_date
     FROM ${BUDGETS_TABLE}
     WHERE user_id = $1
       AND deleted_at IS NULL
       AND $2::date BETWEEN start_date AND end_date
     LIMIT 1`,
    [userId, spent_at]
  );
  return rows[0] ?? null;
};

const findDuplicates = async (userId, { title, amount, spent_at, withinMinutes = 5 }) => {
  // Scoped to the owner: two people recording the same coffee is not a duplicate.
  const { rows } = await pool.query(
    `SELECT id, title, amount, spent_at, created_at
     FROM ${EXPENSES_TABLE}
     WHERE user_id = $1
       AND deleted_at IS NULL
       AND LOWER(title) = LOWER($2)
       AND amount = $3
       AND spent_at = $4
       AND created_at >= NOW() - INTERVAL '1 minute' * $5
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId, title, amount, spent_at ?? new Date(), withinMinutes]
  );
  return rows;
};

const getCurrentBudget = async (userId, budgetId) => {
  const { rows } = await pool.query(
    `SELECT id, name, budget_amount, start_date, end_date
     FROM ${BUDGETS_TABLE}
     WHERE user_id = $1
       AND id = $2
       AND deleted_at IS NULL
     LIMIT 1`,
    [userId, budgetId]
  );
  return rows[0] ?? null;
}

const expenseCreationRecord = async (client, userId, data) => {
  const { rows } = await client.query(
    `INSERT INTO ${EXPENSES_TABLE} (user_id, budget_id, title, expense_amount, category_id, note, spent_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, budget_id, title, expense_amount, category_id, note, spent_at`,
    [
      userId,
      data.budget_id ?? null,
      data.title,
      data.expense_amount,
      data.category_id ?? null,
      data.note ?? null,
      data.spent_at ?? new Date(),
    ]
  );
  return rows[0];
};

const getBudget = async (client, userId, budgetId) => {
  const { rows } = await client.query(
    `SELECT * FROM ${BUDGETS_TABLE}
     WHERE user_id = $1
       AND id = $2
       AND deleted_at IS NULL`,
    [userId, budgetId]
  );
  return rows[0] ?? null;
};


const updateBudgetLeftAmount = async (client, userId, budgetId, amount) => {
  const { rows } = await client.query(
    `UPDATE ${BUDGETS_TABLE}
     SET left_amount = GREATEST(left_amount - $3, 0),
         updated_at = NOW()
     WHERE id = $1
       AND user_id = $2
       AND deleted_at IS NULL
     RETURNING *`,
    [budgetId, userId, amount]
  );
  return rows[0] ?? null;
};


module.exports = {
  createExpense,
  categoryExists,
  findCoveringBudget,
  findDuplicates,
  getCurrentBudget,
  expenseCreationRecord,
  getBudget,
  updateBudgetLeftAmount
};
