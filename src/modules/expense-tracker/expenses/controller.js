const asyncHandler = require('../../../lib/asyncHandler');
const AppError = require('../../../lib/AppError');
const service = require('./service');

exports.attachTag = asyncHandler(async (req, res) => {
  const expenseId = parseInt(req.params.id, 10);
  if (isNaN(expenseId)) throw new AppError('Invalid expense ID', 400);

  const { tag_id } = req.body;
  if (!tag_id) throw new AppError('tag_id is required', 400);

  const tagId = parseInt(tag_id, 10);
  if (isNaN(tagId)) throw new AppError('Invalid tag ID', 400);

  const result = await service.attachTag(expenseId, tagId);
  res.status(201).json({ status: 'success', data: result });
});

exports.detachTag = asyncHandler(async (req, res) => {
  const expenseId = parseInt(req.params.id, 10);
  const tagId = parseInt(req.params.tagId, 10);
  if (isNaN(expenseId)) throw new AppError('Invalid expense ID', 400);
  if (isNaN(tagId)) throw new AppError('Invalid tag ID', 400);

  const result = await service.detachTag(expenseId, tagId);
  res.json({ status: 'success', data: result });
});

exports.listExpenses = asyncHandler(async (req, res) => {
  const result = await service.listExpenses(req.query);
  res.json({
    status: 'success',
    ...result,
  });
});

exports.getExpense = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid expense ID', 400);

  const expense = await service.getExpense(id);
  res.json({ status: 'success', data: expense });
});

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await service.createExpense(req.body);
  res.status(201).json({ status: 'success', data: expense });
});

exports.bulkCreateExpenses = asyncHandler(async (req, res) => {
  const { expenses } = req.body;
  if (!expenses) throw new AppError('expenses array is required in request body', 400);

  const result = await service.bulkCreateExpenses(expenses);
  res.status(201).json({ status: 'success', ...result });
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid expense ID', 400);

  const updated = await service.updateExpense(id, req.body);
  res.json({ status: 'success', data: updated });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid expense ID', 400);

  const deleted = await service.deleteExpense(id);
  res.json({ status: 'success', data: deleted });
});

exports.bulkDeleteExpenses = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids) throw new AppError('ids array is required in request body', 400);

  const result = await service.bulkDeleteExpenses(ids);
  res.json({ status: 'success', ...result });
});
