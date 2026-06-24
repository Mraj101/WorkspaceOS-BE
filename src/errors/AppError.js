/**
 * AppError — Base class for operational (expected) errors.
 *
 * Usage:
 *   throw new AppError('Something went wrong', 500, { code: 'INTERNAL_ERROR' });
 *   throw new ValidationError([{ field: 'title', message: 'title is required' }]);
 *
 * The global errorHandler reads .statusCode, .message, .code, and .details.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = options.code ?? 'ERROR';
    this.details = options.details ?? [];
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
