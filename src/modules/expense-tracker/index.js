/**
 * Expense Tracker module — barrel export.
 * app.js imports this file directly.
 * 
 * This file assembles all the sub-modules (categories, expenses, tags, payment-methods, analytics).
 */
const { Router } = require('express');

const router = Router();



// Core expenses routes
router.use('/expenses', require('./expenses/expense.routes'));
router.use('/budgets', require('./budget/budget.routes'));
// route.use('/categories',require('./category/routes'))

module.exports = router;
