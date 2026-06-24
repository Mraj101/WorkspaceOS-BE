/**
 * logger — Minimal structured logging for errors.
 * Swap implementation (e.g. pino) without changing callers.
 */
const logError = (err, req = {}) => {
  const payload = {
    level: 'error',
    message: err.message,
    code: err.code,
    statusCode: err.statusCode || 500,
    isOperational: err.isOperational,
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  };

  console.error(JSON.stringify(payload));
};

module.exports = { logError };
