const { param, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const handleValidationResult = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result
    .array({ onlyFirstError: true })
    .map((error) => ({ field: error.path, message: error.msg }));
  return next(ApiError.validation(errors));
};

// Usage: router.post('/', validate(rules), controller)
const validate = (rules) => [...rules, handleValidationResult];

const uuidParam = (name = 'id') => param(name).isUUID().withMessage(`${name} must be a valid UUID`);

module.exports = { validate, uuidParam };
