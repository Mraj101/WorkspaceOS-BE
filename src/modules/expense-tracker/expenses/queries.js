const pool = require('../../../config/db');

const EXPENSES_TABLE = 'expense_tracker_expenses';

const createExpense = async ({ title, amount, category_id, note, spent_at, payment_method, is_recurring }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${EXPENSES_TABLE}
       (title, amount, category_id, note, spent_at, payment_method, is_recurring)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      title,
      amount,
      category_id ?? null,
      note ?? null,
      spent_at ?? new Date(),
      payment_method ?? 'cash',
      is_recurring ?? false,
    ]
  );
  return rows[0];
};

const findDuplicates = async ({ title, amount, spent_at, withinMinutes = 5 }) => {
  const { rows } = await pool.query(
    `SELECT id, title, amount, spent_at, created_at
     FROM ${EXPENSES_TABLE}
     WHERE LOWER(title) = LOWER($1)
       AND amount = $2
       AND spent_at = $3
       AND created_at >= NOW() - INTERVAL '1 minute' * $4
     ORDER BY created_at DESC
     LIMIT 5`,
    [title, amount, spent_at ?? new Date(), withinMinutes]
  );
  return rows;
};

module.exports = {
  createExpense,
  findDuplicates,
};
