const q = require('./queries');
const AppError = require('../../../lib/AppError');

exports.listCategories = async () => {
  return await q.getAllCategories();
};

exports.createCategory = async ({ name, icon, color }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new AppError('Category name is required', 400);
  }
  return await q.createCategory({ name: name.trim(), icon, color });
};

exports.deleteCategory = async (id) => {
  const deleted = await q.deleteCategoryById(id);
  if (!deleted) throw new AppError('Category not found', 404);
  return deleted;
};
