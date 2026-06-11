const q = require('./queries');
const AppError = require('../../../lib/AppError');

const MAX_EXPENSE_AMOUNT   = 10_000_000;
const DUPLICATE_WINDOW_MIN = 5;

exports.createExpense = async (expenseData) => {
  const { title, amount, category_id, note, spent_at, payment_method, is_recurring } = expenseData;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new AppError('title is required', 400);
  }

  if (amount === undefined || amount === null) {
    throw new AppError('amount is required', 400);
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new AppError('amount must be a positive number', 400);
  }
  if (parsedAmount > MAX_EXPENSE_AMOUNT) {
    throw new AppError(`amount cannot exceed ${MAX_EXPENSE_AMOUNT.toLocaleString()}`, 400);
  }

  if (spent_at) {
    const spentDate = new Date(spent_at);
    if (isNaN(spentDate.getTime())) {
      throw new AppError('spent_at must be a valid date (YYYY-MM-DD)', 400);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (spentDate >= tomorrow) {
      throw new AppError('spent_at cannot be a future date', 400);
    }
  }

  const duplicates = await q.findDuplicates({
    title: title.trim(),
    amount: parsedAmount,
    spent_at: spent_at || new Date().toISOString().split('T')[0],
    withinMinutes: DUPLICATE_WINDOW_MIN,
  });

  const created = await q.createExpense({
    title: title.trim(),
    amount: parsedAmount,
    category_id: category_id ? parseInt(category_id, 10) : undefined,
    note,
    spent_at,
    payment_method,
    is_recurring: is_recurring ?? false,
  });

  if (duplicates.length > 0) {
    return {
      ...created,
      _warning: {
        message: `Possible duplicate: ${duplicates.length} similar expense(s) found in the last ${DUPLICATE_WINDOW_MIN} minutes`,
        duplicates: duplicates.map(d => ({ id: d.id, title: d.title, amount: d.amount })),
      },
    };
  }

  return created;
};
