const asyncHandler = require('../../../lib/asyncHandler');
const AppError = require('../../../lib/AppError');
const service = require('./service');

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await service.createExpense(req.body);
  res.status(201).json({ status: 'success', data: expense });
});
