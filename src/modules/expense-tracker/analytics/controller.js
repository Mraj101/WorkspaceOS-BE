const asyncHandler = require('../../../lib/asyncHandler');
const service = require('./service');

exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await service.getSummary(req.query);
  res.json({ status: 'success', data: summary });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await service.getAnalytics(req.query);
  res.json({ status: 'success', data: analytics });
});
