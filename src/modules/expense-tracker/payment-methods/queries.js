const pool = require('../../../config/db');

const PAYMENT_METHODS_TABLE = 'expense_tracker_payment_methods';

const getAllPaymentMethods = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM ${PAYMENT_METHODS_TABLE} ORDER BY name ASC`
  );
  return rows;
};

const createPaymentMethod = async ({ name, icon }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${PAYMENT_METHODS_TABLE} (name, icon)
     VALUES ($1, $2)
     RETURNING *`,
    [name, icon ?? null]
  );
  return rows[0];
};

const deletePaymentMethodById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${PAYMENT_METHODS_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

module.exports = {
  getAllPaymentMethods,
  createPaymentMethod,
  deletePaymentMethodById,
};
