/**
 * queryHelpers — Thin, reusable SQL utilities for any module.
 *
 * These are NOT an ORM. They remove repetitive boilerplate while
 * keeping you in full control of SQL.
 *
 * Rules:
 *  - Use these only for SIMPLE queries.
 *  - Complex queries (JOINs, aggregates, filters) → write raw SQL in
 *    the module's own queries.js file.
 *  - Never import from here inside other lib/ files.
 */





const pool = require('../config/db');

/**
 * Get a single row by ID.
 * @param {string} table - Table name (e.g., 'expense_tracker_expenses')
 * @param {number} id
 * @returns {object|null}
 */
const getById = async (table, id) => {
  const { rows } = await pool.query(
    `SELECT * FROM ${table} WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  return rows[0] ?? null;
};

/**
 * Get all rows with an optional WHERE clause.
 * @param {string} table
 * @param {string} whereClause - e.g., 'amount > $1 AND category_id = $2'
 * @param {Array}  params      - Values for the placeholders
 * @returns {Array}
 */
const findMany = async (table, whereClause = '', params = []) => {
  const baseWhere = 'deleted_at IS NULL';
  const where = whereClause ? ` WHERE ${baseWhere} AND (${whereClause})` : ` WHERE ${baseWhere}`;
  const { rows } = await pool.query(
    `SELECT * FROM ${table}${where} ORDER BY id DESC`,
    params
  );
  return rows;
};

/**
 * Insert a row and return the created record.
 * @param {string} table
 * @param {string[]} columns - e.g., ['title', 'amount', 'category_id']
 * @param {Array}   values   - e.g., ['Lunch', 12.50, 1]
 * @returns {object} The inserted row
 */
const create = async (table, columns, values) => {
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  const { rows } = await pool.query(
    `INSERT INTO ${table} (${columns.join(', ')})
     VALUES (${placeholders})
     RETURNING *`,
    values
  );
  return rows[0];
};

/**
 * Delete a row by ID and return the deleted record (or null).
 * @param {string} table
 * @param {number} id
 * @returns {object|null}
 */
const deleteById = async (table, id) => {
  const { rows } = await pool.query(
    `UPDATE ${table} SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

module.exports = { getById, findMany, create, deleteById };
