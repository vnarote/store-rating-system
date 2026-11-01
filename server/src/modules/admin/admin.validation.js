const {
  nameRule,
  emailRule,
  passwordRule,
  optionalAddressRule,
  roleRule,
} = require('../users/user.validation');

const createUserRules = [nameRule(), emailRule(), passwordRule(), optionalAddressRule(), roleRule()];

module.exports = { createUserRules };
