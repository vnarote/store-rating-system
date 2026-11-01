const { body } = require('express-validator');

const ratingValueRule = body('rating')
  .custom((value) => Number.isInteger(value) && value >= 1 && value <= 5)
  .withMessage('Rating must be an integer between 1 and 5');

const createRatingRules = [
  body('storeId').isUUID().withMessage('storeId must be a valid UUID'),
  ratingValueRule,
];

const updateRatingRules = [ratingValueRule];

module.exports = { createRatingRules, updateRatingRules };
