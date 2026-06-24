const q = require('./queries');
const { ValidationError } = require('../../../errors');

const MAX_EXPENSE_AMOUNT   = 10_000_000;
const DUPLICATE_WINDOW_MIN = 5;

exports.createExpense = async (expenseData) => {
  const { title, amount, category_id, note, spent_at, payment_method, is_recurring } = expenseData;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw ValidationError.fromField('title', 'title is required');
  }

  if (amount === undefined || amount === null) {
    throw ValidationError.fromField('amount', 'amount is required');
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw ValidationError.fromField('amount', 'amount must be a positive number');
  }
  if (parsedAmount > MAX_EXPENSE_AMOUNT) {
    throw ValidationError.fromField(
      'amount',
      `amount cannot exceed ${MAX_EXPENSE_AMOUNT.toLocaleString()}`
    );
  }

  if (spent_at) {
    const spentDate = new Date(spent_at);
    if (isNaN(spentDate.getTime())) {
      throw ValidationError.fromField('spent_at', 'spent_at must be a valid date (YYYY-MM-DD)');
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (spentDate >= tomorrow) {
      throw ValidationError.fromField('spent_at', 'spent_at cannot be a future date');
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
