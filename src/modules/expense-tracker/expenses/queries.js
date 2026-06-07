const pool = require('../../../config/db');

const EXPENSES_TABLE        = 'expense_tracker_expenses';
const CATEGORIES_TABLE      = 'expense_tracker_categories';
const TAGS_TABLE            = 'expense_tracker_tags';
const EXPENSE_TAGS_TABLE    = 'expense_tracker_expense_tags';

// ─── EXPENSE ↔ TAG LINKING ───────────────────────────────────────────────────

const getTagsForExpense = async (expenseId) => {
  const { rows } = await pool.query(
    `SELECT t.*
     FROM ${TAGS_TABLE} t
     JOIN ${EXPENSE_TAGS_TABLE} et ON t.id = et.tag_id
     WHERE et.expense_id = $1
     ORDER BY t.name ASC`,
    [expenseId]
  );
  return rows;
};

const attachTagToExpense = async (expenseId, tagId) => {
  const { rows } = await pool.query(
    `INSERT INTO ${EXPENSE_TAGS_TABLE} (expense_id, tag_id)
     VALUES ($1, $2)
     ON CONFLICT (expense_id, tag_id) DO NOTHING
     RETURNING *`,
    [expenseId, tagId]
  );
  return rows[0] ?? null;
};

const detachTagFromExpense = async (expenseId, tagId) => {
  const { rows } = await pool.query(
    `DELETE FROM ${EXPENSE_TAGS_TABLE}
     WHERE expense_id = $1 AND tag_id = $2
     RETURNING *`,
    [expenseId, tagId]
  );
  return rows[0] ?? null;
};

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

const countExpenses = async (filters = {}) => {
  const { conditions, params } = buildExpenseFilterClause(filters);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     ${where}`,
    params
  );
  return rows[0].total;
};

const buildExpenseFilterClause = ({
  category_id, from, to, search,
  payment_method, min_amount, max_amount,
  tags, is_recurring,
} = {}) => {
  const conditions = [];
  const params = [];

  if (category_id) {
    params.push(category_id);
    conditions.push(`e.category_id = $${params.length}`);
  }
  if (from) {
    params.push(from);
    conditions.push(`e.spent_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`e.spent_at <= $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(e.title ILIKE $${params.length} OR e.note ILIKE $${params.length})`);
  }
  if (payment_method) {
    params.push(payment_method);
    conditions.push(`e.payment_method = $${params.length}`);
  }
  if (min_amount !== undefined && min_amount !== null) {
    params.push(min_amount);
    conditions.push(`e.amount >= $${params.length}`);
  }
  if (max_amount !== undefined && max_amount !== null) {
    params.push(max_amount);
    conditions.push(`e.amount <= $${params.length}`);
  }
  if (is_recurring !== undefined) {
    params.push(is_recurring);
    conditions.push(`e.is_recurring = $${params.length}`);
  }
  if (tags && tags.length > 0) {
    params.push(tags);
    conditions.push(`e.id IN (
      SELECT expense_id FROM ${EXPENSE_TAGS_TABLE}
      WHERE tag_id = ANY($${params.length})
    )`);
  }

  return { conditions, params };
};

const SORT_MAP = {
  date_desc:   'e.spent_at DESC, e.created_at DESC',
  date_asc:    'e.spent_at ASC, e.created_at ASC',
  amount_desc: 'e.amount DESC',
  amount_asc:  'e.amount ASC',
  created_desc: 'e.created_at DESC',
  created_asc:  'e.created_at ASC',
};

const getExpenses = async (filters = {}) => {
  const { limit = 50, offset = 0, sort = 'date_desc' } = filters;
  const { conditions, params } = buildExpenseFilterClause(filters);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy = SORT_MAP[sort] || SORT_MAP.date_desc;

  const { rows } = await pool.query(
    `SELECT
       e.*,
       c.name  AS category_name,
       c.icon  AS category_icon,
       c.color AS category_color
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     ${where}
     ORDER BY ${orderBy}
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  return rows;
};

const getExpenseById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       e.*,
       c.name  AS category_name,
       c.icon  AS category_icon,
       c.color AS category_color
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE e.id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

const createExpense = async ({ title, amount, category_id, note, spent_at, payment_method, is_recurring }) => {
  const { rows } = await pool.query(
    `INSERT INTO ${EXPENSES_TABLE}
       (title, amount, category_id, note, spent_at, payment_method, is_recurring)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      title,
      amount,
      category_id ?? null,
      note ?? null,
      spent_at ?? new Date(),
      payment_method ?? 'cash',
      is_recurring ?? false,
    ]
  );
  return rows[0];
};

const bulkCreateExpenses = async (expenses) => {
  if (!expenses.length) return [];

  const columns = ['title', 'amount', 'category_id', 'note', 'spent_at', 'payment_method', 'is_recurring'];
  const params = [];
  const valueSets = [];

  for (const exp of expenses) {
    const offset = params.length;
    params.push(
      exp.title,
      exp.amount,
      exp.category_id ?? null,
      exp.note ?? null,
      exp.spent_at ?? new Date(),
      exp.payment_method ?? 'cash',
      exp.is_recurring ?? false,
    );
    const placeholders = columns.map((_, i) => `$${offset + i + 1}`).join(', ');
    valueSets.push(`(${placeholders})`);
  }

  const { rows } = await pool.query(
    `INSERT INTO ${EXPENSES_TABLE} (${columns.join(', ')})
     VALUES ${valueSets.join(', ')}
     RETURNING *`,
    params
  );
  return rows;
};

const updateExpense = async (id, { title, amount, category_id, note, spent_at, payment_method, is_recurring }) => {
  const fields = [];
  const params = [];

  if (title          !== undefined) { params.push(title);          fields.push(`title = $${params.length}`); }
  if (amount         !== undefined) { params.push(amount);         fields.push(`amount = $${params.length}`); }
  if (category_id    !== undefined) { params.push(category_id);    fields.push(`category_id = $${params.length}`); }
  if (note           !== undefined) { params.push(note);           fields.push(`note = $${params.length}`); }
  if (spent_at       !== undefined) { params.push(spent_at);       fields.push(`spent_at = $${params.length}`); }
  if (payment_method !== undefined) { params.push(payment_method); fields.push(`payment_method = $${params.length}`); }
  if (is_recurring   !== undefined) { params.push(is_recurring);   fields.push(`is_recurring = $${params.length}`); }

  if (fields.length === 0) return null;

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const { rows } = await pool.query(
    `UPDATE ${EXPENSES_TABLE}
     SET ${fields.join(', ')}
     WHERE id = $${params.length}
     RETURNING *`,
    params
  );
  return rows[0] ?? null;
};

const deleteExpenseById = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM ${EXPENSES_TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

const bulkDeleteExpenses = async (ids) => {
  if (!ids.length) return [];
  const { rows } = await pool.query(
    `DELETE FROM ${EXPENSES_TABLE} WHERE id = ANY($1) RETURNING *`,
    [ids]
  );
  return rows;
};

const findDuplicates = async ({ title, amount, spent_at, withinMinutes = 5 }) => {
  const { rows } = await pool.query(
    `SELECT id, title, amount, spent_at, created_at
     FROM ${EXPENSES_TABLE}
     WHERE LOWER(title) = LOWER($1)
       AND amount = $2
       AND spent_at = $3
       AND created_at >= NOW() - INTERVAL '1 minute' * $4
     ORDER BY created_at DESC
     LIMIT 5`,
    [title, amount, spent_at ?? new Date(), withinMinutes]
  );
  return rows;
};

module.exports = {
  getTagsForExpense,
  attachTagToExpense,
  detachTagFromExpense,
  countExpenses,
  getExpenses,
  getExpenseById,
  createExpense,
  bulkCreateExpenses,
  updateExpense,
  deleteExpenseById,
  bulkDeleteExpenses,
  findDuplicates,
};
