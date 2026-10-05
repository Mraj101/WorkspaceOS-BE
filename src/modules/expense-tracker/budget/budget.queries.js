const pool = require('../../../config/db');

const BaseEntity = require('../../../lib/BaseEntity');

const BUDGETS_TABLE = 'expense_tracker_budgets';
const budgetsEntity = new BaseEntity(BUDGETS_TABLE);

const createBudget = async (userId, data) => {
  // BaseEntity strips audit fields internally.
  // user_id comes from the authenticated caller, never from the request body.
  return await budgetsEntity.create({
    user_id: userId,
    name: data.name,
    amount: data.amount,
    start_date: data.start_date,
    end_date: data.end_date,
  });
};

/**
 * Finds the caller's live budgets whose window overlaps the one being
 * created. A budget has no category, so this is a plain user-wide check —
 * at most one budget may cover any given date.
 *
 * Two windows overlap when each starts on or before the other ends.
 * Scoped by user_id: one person's budget must not collide with another's.
 */
const findOverlapping = async (userId, { start_date, end_date }) => {
  const { rows } = await pool.query(
    `SELECT id, name, amount, start_date, end_date
     FROM ${BUDGETS_TABLE}
     WHERE user_id = $1
       AND deleted_at IS NULL
       AND start_date <= $3::date
       AND end_date >= $2::date
     ORDER BY start_date DESC
     LIMIT 5`,
    [userId, start_date, end_date]
  );
  return rows;
};

const getBudgetById = async (userId, budgetId) => {
  return await budgetsEntity.findById(userId,budgetId)
};

const deleteBudget = async (userId, budgetId) => {
  await budgetsEntity.deleteById(userId, budgetId);
}

module.exports = {
  createBudget,
  getBudgetById,
  findOverlapping,
  deleteBudget
};
