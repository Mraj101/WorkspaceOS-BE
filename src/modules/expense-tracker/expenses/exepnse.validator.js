const validateSchema = require('../../../middleware/validateRequired');

/**
 * Validation rules for the Expense module.
 * Centralizing them here keeps the routes file clean and makes it
 * incredibly easy to swap out with Joi or Zod in the future.
 *
 * budget_id is deliberately absent: the server resolves which budget an
 * expense draws from, from its category and date. Clients cannot pick.
 */
module.exports = {
  createExpense: validateSchema({
    title: 'string',
    expense_amount: 'number',
    category_id: 'number?',
    note: 'string?',
    spent_at: 'string?',
    budget_id: 'number?', // optional, but if present must be a number
  }),
  // We can add more here as we build them out:
  // updateExpense: validateSchema({ title: 'string' }),
};
