const asyncHandler = require('../../../lib/asyncHandler');
const AppError = require('../../../lib/AppError');
const service = require('./service');

exports.listTags = asyncHandler(async (req, res) => {
  const tags = await service.listTags();
  res.json({ status: 'success', data: tags });
});

exports.createTag = asyncHandler(async (req, res) => {
  const tag = await service.createTag(req.body);
  res.status(201).json({ status: 'success', data: tag });
});

exports.deleteTag = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) throw new AppError('Invalid tag ID', 400);

  const deleted = await service.deleteTag(id);
  res.json({ status: 'success', data: deleted });
});
