/**
 * Generic API response formatters to ensure consistent JSON structures 
 * across the entire application.
 */

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    data,
    error: false,
    status: statusCode,
    message,
  });
};

const sendError = (res, statusCode, message, extras = {}) => {
  return res.status(statusCode).json({
    data: null,
    error: true,
    status: statusCode,
    message,
    ...extras
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
