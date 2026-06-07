const asyncHandler = require('../../../lib/asyncHandler');
const AppError = require('../../../lib/AppError');
const service = require('./service');

exports.listPaymentMethods = asyncHandler(async (req, res) => {
  const methods = await service.listPaymentMethods();
  res.json({ status: 'success', data: methods });
});

exports.createPaymentMethod = asyncHandler(async (req, res) => {
  const method = await service.createPaymentMethod(req.body);
  res.status(201).json({ status: 'success', data: method });
});

exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid payment method ID', 400);

  const deleted = await service.deletePaymentMethod(id);
  res.json({ status: 'success', data: deleted });
});
