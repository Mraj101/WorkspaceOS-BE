/**
 * asyncHandler — Eliminates try/catch boilerplate in async controllers.
 *
 * Wraps any async route handler and forwards any thrown error
 * to Express's next(err), which the global errorHandler picks up.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 *
 * Without this, an unhandled async rejection would crash the process.
 */
const asyncHandler = (receivedOGFunction) => (req, res, next) =>
  Promise.resolve(receivedOGFunction(req, res, next)).catch(next);

module.exports = asyncHandler;
