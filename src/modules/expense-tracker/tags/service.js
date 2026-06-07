const q = require('./queries');
const AppError = require('../../../lib/AppError');

exports.listTags = async () => {
  return await q.getAllTags();
};

exports.createTag = async ({ name, color }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new AppError('Tag name is required', 400);
  }
  return await q.createTag({ name: name.trim(), color });
};

exports.deleteTag = async (id) => {
  const deleted = await q.deleteTagById(id);
  if (!deleted) throw new AppError('Tag not found', 404);
  return deleted;
};
