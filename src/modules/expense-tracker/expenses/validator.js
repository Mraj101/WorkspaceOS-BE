const validateSchema = require('../../../middleware/validateRequired');

/**
 * Validation rules for the Expense module.
 * Centralizing them here keeps the routes file clean and makes it 
 * incredibly easy to swap out with Joi or Zod in the future.
 */
module.exports = {
  createExpense: validateSchema({
    title: 'string',
    amount: 'number'
  }),
  // We can add more here as we build them out:
  // updateExpense: validateSchema({ title: 'string' }), 
};
