const AppError = require('./AppError');
const { ConflictError } = require('./httpErrors');

/**
 * Maps raw PostgreSQL driver errors to AppError instances.
 * Returns null when the error is not a recognized PG error.
 */
const mapPgError = (err) => {
  if (!err || typeof err.code !== 'string') return null;

  switch (err.code) {
    case '23505':
      return new ConflictError('A record with that value already exists.');

    case '23503':
      return new AppError('Referenced record does not exist.', 400, {
        code: 'FOREIGN_KEY_VIOLATION',
      });

    case '23514':
      return new AppError('Value failed a database constraint check.', 400, {
        code: 'CHECK_CONSTRAINT_VIOLATION',
      });

    case '23502': {
      const column = err.column ? ` (${err.column})` : '';
      return new AppError(`Required field is missing${column}.`, 400, {
        code: 'NOT_NULL_VIOLATION',
        details: err.column ? [{ field: err.column, message: 'Required field is missing' }] : [],
      });
    }

    case '22P02':
      return new AppError('Invalid value provided for a database field.', 400, {
        code: 'INVALID_INPUT',
      });

    case 'ECONNREFUSED':
    case 'ENOTFOUND':
    case 'ETIMEDOUT':
      return new AppError('Database is temporarily unavailable.', 503, {
        code: 'DATABASE_UNAVAILABLE',
      });

    default:
      return null;
  }
};

module.exports = mapPgError;
