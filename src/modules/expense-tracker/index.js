/**
 * Expense Tracker module — barrel export.
 * app.js imports this file directly.
 * 
 * This file assembles all the sub-modules (categories, expenses, tags, payment-methods, analytics).
 */
const { Router } = require('express');

const router = Router();

// Sub-modules
router.use('/categories',      require('./categories/routes'));
router.use('/payment-methods', require('./payment-methods/routes'));
router.use('/tags',            require('./tags/routes'));

// Analytics routes mounted under /expenses
// Note: order matters if they share the base path, but here they are explicitly /expenses/summary and /expenses/analytics
// In our analytics routes, they are defined as /summary and /analytics, so we mount them on /expenses
router.use('/expenses', require('./analytics/routes'));

// Core expenses routes
router.use('/expenses', require('./expenses/routes'));

module.exports = router;
