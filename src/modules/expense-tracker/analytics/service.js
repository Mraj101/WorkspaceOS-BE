const q = require('./queries');

exports.getSummary = async (filters) => {
  return await q.getExpenseSummary(filters);
};

exports.getAnalytics = async (filters) => {
  return await q.getAnalytics(filters);
};
