const pool = require('../../../config/db');

const BaseEntity = require('../../../lib/BaseEntity');

const EXPENSES_TABLE = 'expense_tracker_expenses';
const expensesEntity = new BaseEntity(EXPENSES_TABLE);

const createExpense = async (data) => {
  // We can pass data directly; BaseEntity strips audit fields internally
  return await expensesEntity.create({
    title: data.title,
    amount: data.amount,
    category_id: data.category_id ?? null,
    note: data.note ?? null,
    spent_at: data.spent_at ?? new Date(),
    payment_method: data.payment_method ?? 'cash',
    is_recurring: data.is_recurring ?? false,
  });
};

const findDuplicates = async ({ title, amount, spent_at, withinMinutes = 5 }) => {
  const { rows } = await pool.query(
    `SELECT id, title, amount, spent_at, created_at
     FROM ${EXPENSES_TABLE}
     WHERE LOWER(title) = LOWER($1)
       AND amount = $2
       AND spent_at = $3
       AND created_at >= NOW() - INTERVAL '1 minute' * $4
       AND deleted_at IS NULL
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
