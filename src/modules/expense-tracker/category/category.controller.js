const asyncHandler = require('../../../lib/asyncHandler');
const service = require('./category.service');
const { sendSuccess } = require('../../../lib/response');

/**
 * Create a new category
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await service.createCategory(req.body);
  sendSuccess(res, 201, 'Category created successfully', category);
});

/**
 * Get all categories
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await service.getAllCategories();
  sendSuccess(res, 200, 'Categories retrieved successfully', categories);
});

/**
 * Get category by ID
 */
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await service.getCategoryById(req.params.id);
  sendSuccess(res, 200, 'Category retrieved successfully', category);
});

/**
 * Update category by ID
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await service.updateCategory(req.params.id, req.body);
  sendSuccess(res, 200, 'Category updated successfully', category);
});

/**
 * Delete category by ID
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const result = await service.deleteCategory(req.params.id);
  sendSuccess(res, 200, 'Category deleted successfully', result);
});
