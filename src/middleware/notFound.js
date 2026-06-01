/**
 * notFound — 404 handler for unmatched routes.
 * Must be registered AFTER all route handlers in app.js,
 * and BEFORE the errorHandler.
 */
const notFound = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
