const AppError = require('../errors/AppError');
const mapPgError = require('../errors/pgErrorMapper');
const { logError } = require('../utils/logger');

const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Normalize any thrown value into a consistent AppError-like shape.
 */
const mapError = (err) => {
  if (err instanceof AppError) return err;

  // Malformed JSON body (express.json / body-parser)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new AppError('Invalid JSON in request body', 400, { code: 'INVALID_JSON' });
  }

  const pgError = mapPgError(err);
  if (pgError) return pgError;

  // Unknown / programmer errors — mark non-operational
  if (err instanceof Error) {
    err.statusCode = err.statusCode || 500;
    err.code = err.code || 'INTERNAL_ERROR';
    err.isOperational = false;
    return err;
  }

  return new AppError('Internal Server Error', 500, {
    code: 'INTERNAL_ERROR',
    isOperational: false,
  });
};

const buildExtras = (err, req) => {
  const statusCode = err.statusCode || 500;
  const extras = {
    code: err.code || (statusCode >= 500 ? 'INTERNAL_ERROR' : 'ERROR'),
  };

  if (req.id) {
    extras.requestId = req.id;
  }

  if (Array.isArray(err.details) && err.details.length > 0) {
    extras.details = err.details;
  }

  if (!isProduction() && err.stack) {
    extras.stack = err.stack;
  }

  return extras;
};

/**
 * errorHandler — Global Express error handling middleware.
 *
 * Must be the LAST middleware registered in app.js.
 * Receives errors from:
 *   - throw new AppError(...)        → operational errors (our code)
 *   - pg errors                      → mapped via pgErrorMapper
 *   - any unhandled async throw      → caught by asyncHandler
 *   - notFound middleware            → NotFoundError
 */
const errorHandler = (err, req, res, next) => {
  const normalized = mapError(err);
  const statusCode = normalized.statusCode || 500;
  const isOperational = normalized.isOperational !== false;
  
  const message =
    !isOperational && isProduction()
      ? 'Internal Server Error'
      : normalized.message || 'Internal Server Error';

  const extras = buildExtras(normalized, req);

  if (!normalized.isOperational || statusCode >= 500) {
    logError(normalized, req);
  }

  const { sendError } = require('../lib/response');
  sendError(res, statusCode, message, extras);
};

module.exports = errorHandler;
