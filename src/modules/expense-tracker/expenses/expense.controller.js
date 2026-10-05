const asyncHandler = require('../../../lib/asyncHandler');
const service = require('./expense.service');
const { sendSuccess } = require('../../../lib/response');

exports.createExpense = asyncHandler(async (req, res) => {
  const expense = await service.createExpense(req.user.id, req.body);
  sendSuccess(res, 201, 'Expense created successfully', expense);
});
