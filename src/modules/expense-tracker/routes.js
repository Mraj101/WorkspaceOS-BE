const { Router } = require('express');
const ctrl = require('./controller');

const router = Router();

// ─── Categories ───────────────────────────────────────────────────────────────
router.get   ('/categories',     ctrl.listCategories);
router.post  ('/categories',     ctrl.createCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// ─── Expenses ─────────────────────────────────────────────────────────────────
// NOTE: /expenses/summary MUST be before /expenses/:id
// Otherwise Express matches "summary" as an :id param
router.get   ('/expenses/summary', ctrl.getSummary);
router.get   ('/expenses',         ctrl.listExpenses);
router.get   ('/expenses/:id',     ctrl.getExpense);
router.post  ('/expenses',         ctrl.createExpense);
router.put   ('/expenses/:id',     ctrl.updateExpense);
router.delete('/expenses/:id',     ctrl.deleteExpense);

module.exports = router;
