const { randomUUID } = require('crypto');

/**
 * requestId — Attach a unique ID to each request for tracing in logs and error responses.
 */
const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

module.exports = requestId;
