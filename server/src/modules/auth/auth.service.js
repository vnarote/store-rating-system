const bcrypt = require('bcryptjs');
const userService = require('../users/user.service');
const generateToken = require('../../utils/generateToken');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');
const { ROLES } = require('../../constants/roles');

const register = async ({ name, email, password, address }) => {
  // Public registration can only ever create NORMAL_USER accounts.
  const user = await userService.createUser({ name, email, password, address, role: ROLES.NORMAL_USER });
  return { user, token: generateToken(user) };
};

const login = async ({ email, password }) => {
  const user = await userService.findByEmailWithPassword(email);
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
  if (!passwordMatches) throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS);

  return { user: userService.toSafeUser(user), token: generateToken(user) };
};

const getCurrentUser = async (userId) => userService.toSafeUser(await userService.getUserById(userId));

const changePassword = (userId, payload) => userService.changePassword(userId, payload);

module.exports = { register, login, getCurrentUser, changePassword };
