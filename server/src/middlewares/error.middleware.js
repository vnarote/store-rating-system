const env = require('../config/environment');
const MESSAGES = require('../constants/messages');

// Translates library errors (body parser, Sequelize) into the API's error shape.
const normalizeError = (err) => {
  if (err.type === 'entity.parse.failed') {
    return { statusCode: 400, message: 'Malformed JSON in request body' };
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return { statusCode: 409, message: 'A record with these values already exists' };
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return { statusCode: 409, message: 'Operation violates a data relationship' };
  }
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((item) => ({ field: item.path, message: item.message }));
    return { statusCode: 422, message: 'Validation failed', errors };
  }
  return null;
};

// Express identifies error handlers by their four-argument signature.
const errorHandler = (err, _req, res, _next) => {
  const normalized = normalizeError(err);
  const statusCode = normalized?.statusCode || err.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(err);

  res.status(statusCode).json({
    success: false,
    // Never leak internal details for unexpected errors in production.
    message: isServerError && env.isProduction
      ? MESSAGES.SERVER_ERROR
      : normalized?.message || err.message,
    errors: normalized?.errors || err.errors || [],
    ...(!env.isProduction && isServerError ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
