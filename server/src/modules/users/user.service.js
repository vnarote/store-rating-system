const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');

const SALT_ROUNDS = 10;

const toSafeUser = (user) => {
  const safeUser = user.toJSON();
  delete safeUser.password;
  return safeUser;
};

const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

const findByEmailWithPassword = (email) => User.scope('withPassword').findOne({ where: { email } });

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw ApiError.notFound(MESSAGES.USER_NOT_FOUND);
  return user;
};

const createUser = async ({ name, email, password, address, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw ApiError.conflict(MESSAGES.EMAIL_EXISTS);

  const user = await User.create({
    name,
    email,
    address,
    role,
    password: await hashPassword(password),
  });
  return toSafeUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.scope('withPassword').findByPk(userId);
  if (!user) throw ApiError.notFound(MESSAGES.USER_NOT_FOUND);

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) throw ApiError.badRequest(MESSAGES.WRONG_CURRENT_PASSWORD);

  user.password = await hashPassword(newPassword);
  await user.save();
};

module.exports = { toSafeUser, findByEmailWithPassword, getUserById, createUser, changePassword };
