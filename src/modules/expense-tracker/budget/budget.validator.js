const validateSchema = require('../../../middleware/validateRequired');

/**
 * Validation rules for the Budget module.
 * Shape-only checks live here; business rules (date ordering, overlap
 * detection) live in budget.service.js.
 *
 * A budget is a pot with a fixed window, so both dates are required.
 * No category_id — a budget is one pot for everything in its window;
 * category is a tag on the expense, not a split of the budget.
 */
module.exports = {
  createBudget: validateSchema({
    name: 'string',
    amount: 'number',
    start_date: 'string',
    end_date: 'string'
  }),

  deleteBudget: validateSchema({
    // budget_id: 'number'
  }),
  // We can add more here as we build them out:
  // updateBudget: validateSchema({ amount: 'number?' }),
};
