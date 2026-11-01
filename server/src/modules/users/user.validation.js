const { body } = require('express-validator');
const { ROLE_VALUES } = require('../../constants/roles');

// Single source of truth for field rules; auth, admin and store validators reuse these.
const requiredString = (field, label) =>
  body(field)
    .exists({ values: 'null' })
    .withMessage(`${label} is required`)
    .bail()
    .isString()
    .withMessage(`${label} must be a string`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .bail();

const nameRule = (field = 'name') =>
  requiredString(field, 'Name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

const emailRule = (field = 'email') =>
  requiredString(field, 'Email')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Email must be at most 255 characters')
    .toLowerCase();

const passwordRule = (field = 'password') =>
  body(field)
    .exists({ values: 'null' })
    .withMessage('Password is required')
    .bail()
    .isString()
    .withMessage('Password must be a string')
    .bail()
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character');

const optionalAddressRule = (field = 'address') =>
  body(field)
    .optional({ values: 'null' })
    .isString()
    .withMessage('Address must be a string')
    .bail()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters');

const requiredAddressRule = (field = 'address') =>
  requiredString(field, 'Address')
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters');

const roleRule = (field = 'role') =>
  body(field)
    .exists({ values: 'null' })
    .withMessage('Role is required')
    .bail()
    .isIn(ROLE_VALUES)
    .withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}`);

module.exports = {
  requiredString,
  nameRule,
  emailRule,
  passwordRule,
  optionalAddressRule,
  requiredAddressRule,
  roleRule,
};
