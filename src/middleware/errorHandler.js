/**
 * errorHandler — Global Express error handling middleware.
 *
 * Must be the LAST middleware registered in app.js.
 * Receives errors from:
 *   - throw new AppError(...)   → operational errors (our code)
 *   - pg errors                 → database errors
 *   - any unhandled async throw → caught by asyncHandler
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no statusCode set
  const statusCode = err.statusCode || 500;

  // Log unexpected (non-operational) errors fully
  if (!err.isOperational) {
    console.error('💥 Unexpected error:', err);
  }

  // PostgreSQL unique constraint violation (code 23505)
  if (err.code === '23505') {
    return res.status(409).json({
      status: 'error',
      message: 'A record with that value already exists.',
    });
  }

  // PostgreSQL foreign key violation (code 23503)
  if (err.code === '23503') {
    return res.status(400).json({
      status: 'error',
      message: 'Referenced record does not exist.',
    });
  }

  // PostgreSQL check constraint violation (code 23514)
  if (err.code === '23514') {
    return res.status(400).json({
      status: 'error',
      message: 'Value failed a database constraint check.',
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
