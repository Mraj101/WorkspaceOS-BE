const q = require('./queries');
const categoryQueries = require('../categories/queries');
const tagQueries = require('../tags/queries');
const AppError = require('../../../lib/AppError');

const MAX_EXPENSE_AMOUNT   = 10_000_000;
const DUPLICATE_WINDOW_MIN = 5;
const DEFAULT_PAGE_SIZE    = 20;
const MAX_PAGE_SIZE        = 100;
const MAX_BULK_SIZE        = 50;

// ─── EXPENSE ↔ TAG LINKING ───────────────────────────────────────────────────

exports.attachTag = async (expenseId, tagId) => {
  const expense = await q.getExpenseById(expenseId);
  if (!expense) throw new AppError('Expense not found', 404);

  const tags = await tagQueries.getAllTags();
  const tagExists = tags.find(t => t.id === tagId);
  if (!tagExists) throw new AppError('Tag not found', 404);

  const link = await q.attachTagToExpense(expenseId, tagId);
  if (!link) {
    return { message: 'Tag already attached to this expense' };
  }
  return link;
};

exports.detachTag = async (expenseId, tagId) => {
  const removed = await q.detachTagFromExpense(expenseId, tagId);
  if (!removed) throw new AppError('Tag was not attached to this expense', 404);
  return removed;
};

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

exports.listExpenses = async (filters) => {
  const page     = Math.max(1, parseInt(filters.page, 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(filters.pageSize, 10) || DEFAULT_PAGE_SIZE)
  );
  const offset   = (page - 1) * pageSize;

  let tags;
  if (filters.tags) {
    tags = filters.tags.split(',').map(t => parseInt(t.trim(), 10)).filter(n => !isNaN(n));
    if (tags.length === 0) tags = undefined;
  }

  const min_amount = filters.min_amount ? parseFloat(filters.min_amount) : undefined;
  const max_amount = filters.max_amount ? parseFloat(filters.max_amount) : undefined;

  const queryFilters = {
    ...filters,
    tags,
    min_amount,
    max_amount,
    limit: pageSize,
    offset,
  };

  const [data, total] = await Promise.all([
    q.getExpenses(queryFilters),
    q.countExpenses(queryFilters),
  ]);

  const dataWithTags = await Promise.all(
    data.map(async (expense) => {
      const expenseTags = await q.getTagsForExpense(expense.id);
      return { ...expense, tags: expenseTags };
    })
  );

  return {
    data: dataWithTags,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

exports.getExpense = async (id) => {
  const expense = await q.getExpenseById(id);
  if (!expense) throw new AppError('Expense not found', 404);

  const tags = await q.getTagsForExpense(id);
  return { ...expense, tags };
};

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

  if (category_id !== undefined && category_id !== null) {
    const parsedCatId = parseInt(category_id, 10);
    if (isNaN(parsedCatId)) {
      throw new AppError('category_id must be a valid integer', 400);
    }
    const category = await categoryQueries.getCategoryById(parsedCatId);
    if (!category) {
      throw new AppError(`Category with ID ${parsedCatId} does not exist`, 404);
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

exports.bulkCreateExpenses = async (expenses) => {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    throw new AppError('expenses must be a non-empty array', 400);
  }
  if (expenses.length > MAX_BULK_SIZE) {
    throw new AppError(`Cannot bulk create more than ${MAX_BULK_SIZE} expenses at once`, 400);
  }

  const validated = [];
  const errors = [];

  for (let i = 0; i < expenses.length; i++) {
    const exp = expenses[i];
    try {
      if (!exp.title || typeof exp.title !== 'string' || !exp.title.trim()) {
        throw new Error('title is required');
      }
      const parsedAmount = parseFloat(exp.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('amount must be a positive number');
      }
      if (parsedAmount > MAX_EXPENSE_AMOUNT) {
        throw new Error(`amount cannot exceed ${MAX_EXPENSE_AMOUNT.toLocaleString()}`);
      }

      validated.push({
        title: exp.title.trim(),
        amount: parsedAmount,
        category_id: exp.category_id ? parseInt(exp.category_id, 10) : null,
        note: exp.note ?? null,
        spent_at: exp.spent_at,
        payment_method: exp.payment_method ?? 'cash',
        is_recurring: exp.is_recurring ?? false,
      });
    } catch (err) {
      errors.push({ index: i, title: exp.title, error: err.message });
    }
  }

  if (errors.length > 0 && validated.length === 0) {
    throw new AppError('All expenses failed validation', 400, errors);
  }

  const created = validated.length > 0 ? await q.bulkCreateExpenses(validated) : [];

  return {
    created_count: created.length,
    error_count: errors.length,
    data: created,
    errors: errors.length > 0 ? errors : undefined,
  };
};

exports.updateExpense = async (id, updateData) => {
  const { amount, title, category_id, note, spent_at, payment_method, is_recurring } = updateData;

  if (amount !== undefined) {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      throw new AppError('amount must be a positive number', 400);
    }
    if (parsed > MAX_EXPENSE_AMOUNT) {
      throw new AppError(`amount cannot exceed ${MAX_EXPENSE_AMOUNT.toLocaleString()}`, 400);
    }
  }

  if (spent_at !== undefined) {
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

  if (category_id !== undefined && category_id !== null) {
    const parsedCatId = parseInt(category_id, 10);
    if (isNaN(parsedCatId)) {
      throw new AppError('category_id must be a valid integer', 400);
    }
    const category = await categoryQueries.getCategoryById(parsedCatId);
    if (!category) {
      throw new AppError(`Category with ID ${parsedCatId} does not exist`, 404);
    }
  }

  const updateFields = { title, amount, category_id, note, spent_at, payment_method, is_recurring };
  const hasUpdate = Object.values(updateFields).some(v => v !== undefined);
  if (!hasUpdate) {
    throw new AppError('No fields provided to update', 400);
  }

  const updated = await q.updateExpense(id, updateFields);
  if (!updated) throw new AppError('Expense not found', 404);

  const tags = await q.getTagsForExpense(id);
  return { ...updated, tags };
};

exports.deleteExpense = async (id) => {
  const deleted = await q.deleteExpenseById(id);
  if (!deleted) throw new AppError('Expense not found', 404);
  return deleted;
};

exports.bulkDeleteExpenses = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError('ids must be a non-empty array of expense IDs', 400);
  }

  const parsedIds = ids.map(id => {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) throw new AppError(`Invalid ID: ${id}`, 400);
    return parsed;
  });

  const deleted = await q.bulkDeleteExpenses(parsedIds);
  return {
    requested: parsedIds.length,
    deleted: deleted.length,
    data: deleted,
  };
};
