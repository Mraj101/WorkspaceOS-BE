/**
 * expense-tracker/controller.js
 *
 * HTTP layer ONLY — control points.
 * Extracts params/body from req, passes to service layer, and sends res.
 * No business logic or SQL here.
 */
const asyncHandler = require('../../lib/asyncHandler');
const AppError = require('../../lib/AppError');
const service = require('./service');

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

exports.listCategories = asyncHandler(async (req, res) => {
  const categories = await service.listCategories();
  res.json({ status: 'success', data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await service.createCategory(req.body);
  res.status(201).json({ status: 'success', data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid category ID', 400);

  const deleted = await service.deleteCategory(id);
  res.json({ status: 'success', data: deleted });
});

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

exports.listExpenses = asyncHandler(async (req, res) => {
  const expenses = await service.listExpenses(req.query);
  res.json({ status: 'success', count: expenses.length, data: expenses });
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

exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await service.getSummary(req.query);
  res.json({ status: 'success', data: summary });
});
