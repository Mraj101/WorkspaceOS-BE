const q = require('./budget.queries');
const { ValidationError, ConflictError } = require('../../../errors');

const MAX_BUDGET_AMOUNT = 100_000_000;
const MAX_NAME_LENGTH = 100;

/**
 * Parses a YYYY-MM-DD style date and fails with a field error if it's unusable.
 * Returns the normalized YYYY-MM-DD string so Postgres always gets a plain date.
 */
const parseDateField = (field, value) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw ValidationError.fromField(field, `${field} must be a valid date (YYYY-MM-DD)`);
  }
  return date.toISOString().split('T')[0];
};

exports.createBudget = async (userId, budgetData) => {
  const { name, amount, start_date, end_date } = budgetData;

  const trimmedName = name.trim();
  if (trimmedName.length > MAX_NAME_LENGTH) {
    throw ValidationError.fromField('name', `name cannot exceed ${MAX_NAME_LENGTH} characters`);
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw ValidationError.fromField('amount', 'amount must be a positive number');
  }
  if (parsedAmount > MAX_BUDGET_AMOUNT) {
    throw ValidationError.fromField(
      'amount',
      `amount cannot exceed ${MAX_BUDGET_AMOUNT.toLocaleString()}`
    );
  }

  // A budget is a pot with a fixed window — both ends are required.
  // Budgets may start in the future, so there's no "no future dates" rule here.
  const resolvedStart = parseDateField('start_date', start_date);
  const resolvedEnd = parseDateField('end_date', end_date);

  if (resolvedEnd <= resolvedStart) {
    throw ValidationError.fromField('end_date', 'end_date must be after start_date');
  }

  // A budget has no category — it's one pot for the whole window. So no two
  // of a user's budgets may cover the same date at all, or an expense in that
  // overlap would have two pots to draw from and "what's left" stops being
  // a single number.
  const overlapping = await q.findOverlapping(userId, {
    start_date: resolvedStart,
    end_date: resolvedEnd,
  });

  if (overlapping.length > 0) {
    throw new ConflictError(
      `A budget already covers this date range (budget #${overlapping[0].id} "${overlapping[0].name}")`
    );
  }

  return await q.createBudget(userId, {
    name: trimmedName,
    amount: parsedAmount,
    start_date: resolvedStart,
    end_date: resolvedEnd,
  });
};

exports.deleteBudget = async(userId,budgetId)=>{
  const budget = await q.getBudgetById(userId,budgetId);
  console.log("deleteBudget",budget);
  if(!budget){
    throw ValidationError.fromField('budget_id','Budget not found');
  }
  await q.deleteBudget(userId,budgetId);
  return budget;
}