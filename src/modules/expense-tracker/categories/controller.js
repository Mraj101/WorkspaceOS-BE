const asyncHandler = require('../../../lib/asyncHandler');
const AppError = require('../../../lib/AppError');
const service = require('./service');

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
