const q = require('./expense.queries');
const { ValidationError, NotFoundError } = require('../../../errors');
const pool = require('../../../config/db');

const MAX_EXPENSE_AMOUNT = 10_000_000;
const DUPLICATE_WINDOW_MIN = 5;



exports.createExpense = async (userId, expenseData) => {
  const { title, expense_amount: amount, category_id, note, spent_at, budget_id } = expenseData;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw ValidationError.fromField('expense_amount', 'amount must be a positive number');
  }
  if (parsedAmount > MAX_EXPENSE_AMOUNT) {
    throw ValidationError.fromField(
      'expense_amount',
      `amount cannot exceed ${MAX_EXPENSE_AMOUNT.toLocaleString()}`
    );
  }

  const spentDate = spent_at ? new Date(spent_at) : new Date();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const budget = await q.getBudget(client, userId, budget_id);
    if (!budget) {
      throw NotFoundError.fromField('budget_id', 'Budget not found');
    }

    const expense = await q.expenseCreationRecord(client, userId, {
      title,
      expense_amount: parsedAmount,
      category_id,
      note,
      spent_at: spentDate,
      budget_id,
    });

    const updatedBudget = await q.updateBudgetLeftAmount(client, userId, budget_id, parsedAmount);

    await client.query('COMMIT');

    return { expense, budget: updatedBudget };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};