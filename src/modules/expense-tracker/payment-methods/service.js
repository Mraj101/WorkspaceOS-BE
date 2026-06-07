const q = require('./queries');
const AppError = require('../../../lib/AppError');

exports.listPaymentMethods = async () => {
  return await q.getAllPaymentMethods();
};

exports.createPaymentMethod = async ({ name, icon }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new AppError('Payment method name is required', 400);
  }
  return await q.createPaymentMethod({ name: name.trim(), icon });
};

exports.deletePaymentMethod = async (id) => {
  const deleted = await q.deletePaymentMethodById(id);
  if (!deleted) throw new AppError('Payment method not found', 404);
  return deleted;
};
