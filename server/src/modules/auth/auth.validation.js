const { body } = require('express-validator');
const {
  nameRule,
  emailRule,
  passwordRule,
  optionalAddressRule,
  requiredString,
} = require('../users/user.validation');

const registerRules = [nameRule(), emailRule(), passwordRule(), optionalAddressRule()];

// Login deliberately avoids revealing which rule failed beyond basic shape checks.
const loginRules = [
  requiredString('email', 'Email').isEmail().withMessage('Email must be a valid email address').toLowerCase(),
  body('password').isString().withMessage('Password is required').bail().notEmpty().withMessage('Password is required'),
];

const changePasswordRules = [
  body('currentPassword').isString().withMessage('Current password is required').bail().notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
  body('newPassword')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current password'),
];

module.exports = { registerRules, loginRules, changePasswordRules };
