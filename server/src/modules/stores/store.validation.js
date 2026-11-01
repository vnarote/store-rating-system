const { body } = require('express-validator');
const { nameRule, emailRule, requiredAddressRule } = require('../users/user.validation');

const createStoreRules = [
  nameRule(),
  emailRule(),
  requiredAddressRule(),
  body('ownerId').isUUID().withMessage('ownerId must be a valid UUID'),
];

module.exports = { createStoreRules };
