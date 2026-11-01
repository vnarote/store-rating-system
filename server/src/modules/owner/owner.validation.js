const { query } = require('express-validator');

const listRatingsRules = [
  query('storeId').optional().isUUID().withMessage('storeId must be a valid UUID'),
];

module.exports = { listRatingsRules };
