const pool = require('../../../config/db');

const TAGS_TABLE = 'expense_tracker_tags';

const getAllTags = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM ${TAGS_TABLE} ORDER BY name ASC`
  );
  return rows;
};

const createTag = async ({ name, color }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${TAGS_TABLE} (name, color)
     VALUES ($1, $2)
     RETURNING *`,
    [name, color ?? '#6B7280']
  );
  return rows[0];
};

const deleteTagById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${TAGS_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

module.exports = {
  getAllTags,
  createTag,
  deleteTagById,
};
