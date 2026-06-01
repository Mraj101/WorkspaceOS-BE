/**
 * AppError — Custom error class for operational errors.
 *
 * Usage:
 *   throw new AppError('Expense not found', 404);
 *   throw new AppError('title and amount are required', 400);
 *
 * The global errorHandler middleware reads .statusCode and .message.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes from unexpected crashes
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
