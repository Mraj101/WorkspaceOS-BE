const pool = require('../../../config/db');

const EXPENSES_TABLE   = 'expense_tracker_expenses';
const CATEGORIES_TABLE = 'expense_tracker_categories';

/**
 * Summary: total amount spent per category.
 * Optionally filter by date range.
 */
const getExpenseSummary = async ({ from, to } = {}) => {
  const conditions = ['1=1'];
  const params     = [];

  if (from) { params.push(from); conditions.push(`e.spent_at >= $${params.length}`); }
  if (to)   { params.push(to);   conditions.push(`e.spent_at <= $${params.length}`); }

  const { rows } = await pool.query(
    `SELECT
       COALESCE(c.name, 'Uncategorized') AS category,
       c.icon,
       c.color,
       COUNT(e.id)          AS expense_count,
       SUM(e.amount)        AS total_amount
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE ${conditions.join(' AND ')}
     GROUP BY c.name, c.icon, c.color
     ORDER BY total_amount DESC`,
    params
  );
  return rows;
};

/**
 * Get comprehensive spending analytics.
 */
const getAnalytics = async ({ from, to } = {}) => {
  const effectiveTo   = to   || new Date().toISOString().split('T')[0];
  const effectiveFrom = from || (() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  })();

  const [overview, byCategory, byPaymentMethod, dailyTrends, monthlyTrends, comparison] =
    await Promise.all([
      getOverview(effectiveFrom, effectiveTo),
      getCategoryBreakdown(effectiveFrom, effectiveTo),
      getPaymentMethodBreakdown(effectiveFrom, effectiveTo),
      getDailyTrends(effectiveFrom, effectiveTo),
      getMonthlyTrends(effectiveFrom, effectiveTo),
      getMonthComparison(),
    ]);

  return {
    period: { from: effectiveFrom, to: effectiveTo },
    overview,
    by_category: byCategory,
    by_payment_method: byPaymentMethod,
    trends: {
      daily: dailyTrends,
      monthly: monthlyTrends,
    },
    comparison,
  };
};

const getOverview = async (from, to) => {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(SUM(amount), 0)::numeric     AS total_spent,
       COUNT(*)::int                          AS expense_count,
       COALESCE(AVG(amount), 0)::numeric     AS avg_per_expense,
       COALESCE(MIN(amount), 0)::numeric     AS min_expense,
       COALESCE(MAX(amount), 0)::numeric     AS max_expense
     FROM ${EXPENSES_TABLE}
     WHERE spent_at >= $1 AND spent_at <= $2`,
    [from, to]
  );

  const stats = rows[0];

  const dayCount = Math.max(1, Math.ceil(
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)
  ) + 1);

  const { rows: topRows } = await pool.query(
    `SELECT id, title, amount, spent_at
     FROM ${EXPENSES_TABLE}
     WHERE spent_at >= $1 AND spent_at <= $2
     ORDER BY amount DESC
     LIMIT 1`,
    [from, to]
  );

  const { rows: topCatRows } = await pool.query(
    `SELECT COALESCE(c.name, 'Uncategorized') AS category
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE e.spent_at >= $1 AND e.spent_at <= $2
     GROUP BY c.name
     ORDER BY SUM(e.amount) DESC
     LIMIT 1`,
    [from, to]
  );

  return {
    total_spent: parseFloat(stats.total_spent),
    expense_count: stats.expense_count,
    avg_per_expense: Math.round(parseFloat(stats.avg_per_expense) * 100) / 100,
    avg_daily: Math.round((parseFloat(stats.total_spent) / dayCount) * 100) / 100,
    min_expense: parseFloat(stats.min_expense),
    max_expense: parseFloat(stats.max_expense),
    most_expensive: topRows[0] || null,
    top_category: topCatRows[0]?.category || null,
  };
};

const getCategoryBreakdown = async (from, to) => {
  const { rows } = await pool.query(
    `WITH totals AS (
       SELECT SUM(amount) AS grand_total
       FROM ${EXPENSES_TABLE}
       WHERE spent_at >= $1 AND spent_at <= $2
     )
     SELECT
       COALESCE(c.name, 'Uncategorized') AS category,
       c.icon,
       c.color,
       COUNT(e.id)::int                  AS count,
       SUM(e.amount)::numeric            AS total,
       ROUND(
         SUM(e.amount) * 100.0 / NULLIF((SELECT grand_total FROM totals), 0),
         1
       )::numeric                        AS percentage
     FROM ${EXPENSES_TABLE} e
     LEFT JOIN ${CATEGORIES_TABLE} c ON e.category_id = c.id
     WHERE e.spent_at >= $1 AND e.spent_at <= $2
     GROUP BY c.name, c.icon, c.color
     ORDER BY total DESC`,
    [from, to]
  );

  return rows.map(r => ({
    ...r,
    total: parseFloat(r.total),
    percentage: parseFloat(r.percentage) || 0,
  }));
};

const getPaymentMethodBreakdown = async (from, to) => {
  const { rows } = await pool.query(
    `WITH totals AS (
       SELECT SUM(amount) AS grand_total
       FROM ${EXPENSES_TABLE}
       WHERE spent_at >= $1 AND spent_at <= $2
     )
     SELECT
       COALESCE(e.payment_method, 'unknown') AS method,
       COUNT(e.id)::int                      AS count,
       SUM(e.amount)::numeric                AS total,
       ROUND(
         SUM(e.amount) * 100.0 / NULLIF((SELECT grand_total FROM totals), 0),
         1
       )::numeric                            AS percentage
     FROM ${EXPENSES_TABLE} e
     WHERE e.spent_at >= $1 AND e.spent_at <= $2
     GROUP BY e.payment_method
     ORDER BY total DESC`,
    [from, to]
  );

  return rows.map(r => ({
    ...r,
    total: parseFloat(r.total),
    percentage: parseFloat(r.percentage) || 0,
  }));
};

const getDailyTrends = async (from, to) => {
  const { rows } = await pool.query(
    `SELECT
       spent_at::text               AS date,
       COUNT(*)::int                AS count,
       SUM(amount)::numeric         AS total
     FROM ${EXPENSES_TABLE}
     WHERE spent_at >= $1 AND spent_at <= $2
     GROUP BY spent_at
     ORDER BY spent_at ASC`,
    [from, to]
  );

  return rows.map(r => ({
    ...r,
    total: parseFloat(r.total),
  }));
};

const getMonthlyTrends = async (from, to) => {
  const { rows } = await pool.query(
    `SELECT
       TO_CHAR(spent_at, 'YYYY-MM') AS month,
       COUNT(*)::int                AS count,
       SUM(amount)::numeric         AS total
     FROM ${EXPENSES_TABLE}
     WHERE spent_at >= $1 AND spent_at <= $2
     GROUP BY TO_CHAR(spent_at, 'YYYY-MM')
     ORDER BY month ASC`,
    [from, to]
  );

  return rows.map(r => ({
    ...r,
    total: parseFloat(r.total),
  }));
};

const getMonthComparison = async () => {
  const { rows } = await pool.query(
    `WITH current_month AS (
       SELECT COALESCE(SUM(amount), 0)::numeric AS total
       FROM ${EXPENSES_TABLE}
       WHERE spent_at >= DATE_TRUNC('month', CURRENT_DATE)
         AND spent_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
     ),
     previous_month AS (
       SELECT COALESCE(SUM(amount), 0)::numeric AS total
       FROM ${EXPENSES_TABLE}
       WHERE spent_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
         AND spent_at < DATE_TRUNC('month', CURRENT_DATE)
     )
     SELECT
       cm.total AS current_month,
       pm.total AS previous_month
     FROM current_month cm, previous_month pm`
  );

  const { current_month, previous_month } = rows[0];
  const current = parseFloat(current_month);
  const previous = parseFloat(previous_month);

  return {
    current_month: current,
    previous_month: previous,
    change_amount: Math.round((current - previous) * 100) / 100,
    change_pct: previous > 0
      ? Math.round(((current - previous) / previous) * 1000) / 10
      : null,
  };
};

module.exports = {
  getExpenseSummary,
  getAnalytics,
};
