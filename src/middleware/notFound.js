const { NotFoundError } = require('../errors');

/**
 * notFound — 404 handler for unmatched routes.
 * Must be registered AFTER all route handlers in app.js,
 * and BEFORE the errorHandler.
 */
const notFound = (req, res, next) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
