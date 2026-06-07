const pool = require('../../../config/db');

const CATEGORIES_TABLE = 'expense_tracker_categories';

const getAllCategories = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM ${CATEGORIES_TABLE} ORDER BY name ASC`
  );
  return rows;
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${CATEGORIES_TABLE} WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

const createCategory = async ({ name, icon, color }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${CATEGORIES_TABLE} (name, icon, color)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, icon ?? null, color ?? '#6B7280']
  );
  return rows[0];
};

const deleteCategoryById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${CATEGORIES_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategoryById,
};
