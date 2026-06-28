const asyncHandler = require('../../../lib/asyncHandler');
const service = require('./service');
const { sendSuccess } = require('../../../lib/response');

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await service.createExpense(req.body);
  sendSuccess(res, 201, 'Expense created successfully', expense);
});
