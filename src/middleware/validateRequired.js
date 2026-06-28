const { ValidationError } = require('../errors');

/**
 * Middleware to validate that required fields are present and match expected types.
 * @param {Object} schema - Key-value pair of field names and their expected JavaScript types.
 *                          Example: { title: 'string', amount: 'number' }
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    const errors = {};

    for (const [field, expectedType] of Object.entries(schema)) {
      const value = req.body[field];
      
      const isOptional = expectedType.endsWith('?');
      const baseType = isOptional ? expectedType.slice(0, -1) : expectedType;

      // 1. Check if value is missing, null, or an empty string
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        if (!isOptional) {
          errors[field] = `${field} is required`;
        }
        continue; // Skip type check if it's missing
      }

      // 2. Check if the type matches what was defined
      if (typeof value !== baseType) {
        errors[field] = `${field} must be of type ${baseType}, but got ${typeof value}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return next(ValidationError.fromFields(errors));
    }

    next();
  };
};

module.exports = validateSchema;

