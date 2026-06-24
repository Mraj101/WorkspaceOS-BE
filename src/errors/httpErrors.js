const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(messageOrResource, id) {
    const message =
      id !== undefined && id !== null
        ? `${messageOrResource} not found`
        : messageOrResource;
    super(message, 404, { code: 'NOT_FOUND' });
  }
}

class ValidationError extends AppError {
  constructor(details, message = 'Validation failed') {
    super(message, 400, { code: 'VALIDATION_ERROR', details });
  }

  static fromField(field, message) {
    return new ValidationError([{ field, message }]);
  }

  static fromFields(fieldMessages) {
    const details = Object.entries(fieldMessages).map(([field, message]) => ({
      field,
      message,
    }));
    return new ValidationError(details);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, { code: 'CONFLICT' });
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, { code: 'UNAUTHORIZED' });
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
};
