const { ValidationError } = require('../errors');

/**
 * Middleware to validate that required fields are present in the request body.
 * @param {string[]} fields - Array of required field names.
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = {};

    for (const field of fields) {
      const value = req.body[field];
      // Check if value is missing, null, or an empty string
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        missingFields[field] = `${field} is required`;
      }
    }

    if (Object.keys(missingFields).length > 0) {
      return next(ValidationError.fromFields(missingFields));
    }

    next();
  };
};

module.exports = validateRequired;
