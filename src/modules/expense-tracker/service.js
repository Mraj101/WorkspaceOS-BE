const q = require('./queries');
const AppError = require('../../lib/AppError');

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

exports.listCategories = async () => {
  return await q.getAllCategories();
};

exports.createCategory = async ({ name, icon, color }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new AppError('Category name is required', 400);
  }
  return await q.createCategory({ name: name.trim(), icon, color });
};

exports.deleteCategory = async (id) => {
  const deleted = await q.deleteCategoryById(id);
  if (!deleted) throw new AppError('Category not found', 404);
  return deleted;
};

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

exports.listExpenses = async (filters) => {
  // Set default pagination if not provided
  const limit = filters.limit ? parseInt(filters.limit, 10) : 50;
  const offset = filters.offset ? parseInt(filters.offset, 10) : 0;
  const category_id = filters.category_id ? parseInt(filters.category_id, 10) : undefined;

  return await q.getExpenses({ ...filters, limit, offset, category_id });
};

exports.getExpense = async (id) => {
  const expense = await q.getExpenseById(id);
  if (!expense) throw new AppError('Expense not found', 404);
  return expense;
};

exports.createExpense = async (expenseData) => {
  const { title, amount, category_id, note, spent_at } = expenseData;

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

  return await q.createExpense({
    title: title.trim(),
    amount: parsedAmount,
    category_id: category_id ? parseInt(category_id, 10) : undefined,
    note,
    spent_at,
  });
};

exports.updateExpense = async (id, updateData) => {
  const { amount, title, category_id, note, spent_at } = updateData;

  if (amount !== undefined) {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError('No fields provided to update', 400);
  }

  const updated = await q.updateExpense(id, { title, amount, category_id, note, spent_at });
  if (!updated) throw new AppError('Expense not found', 404);
  return updated;
};

exports.deleteExpense = async (id) => {
  const deleted = await q.deleteExpenseById(id);
  if (!deleted) throw new AppError('Expense not found', 404);
  return deleted;
};

exports.getSummary = async (filters) => {
  return await q.getExpenseSummary(filters);
};
