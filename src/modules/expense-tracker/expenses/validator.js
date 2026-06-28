const validateRequired = require('../../../middleware/validateRequired');

/**
 * Validation rules for the Expense module.
 * Centralizing them here keeps the routes file clean and makes it 
 * incredibly easy to swap out with Joi or Zod in the future.
 */
module.exports = {
  createExpense: validateRequired(['title', 'amount']),
  // We can add more here as we build them out:
  // updateExpense: validateRequired(['title']), 
};
