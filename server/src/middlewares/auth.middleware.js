const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const extractToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

const authenticateUser = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized('Authentication token is missing');

  let payload;
  try {
    payload = jwt.verify(token, env.jwt.secret);
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
    throw ApiError.unauthorized(message);
  }

  // The database is the source of truth for the role, not the token.
  const user = await User.findByPk(payload.userId);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
});

module.exports = { authenticateUser };
