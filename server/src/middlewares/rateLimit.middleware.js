const rateLimit = require('express-rate-limit');
const env = require('../config/environment');
const ApiError = require('../utils/ApiError');
const MESSAGES = require('../constants/messages');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(ApiError.tooManyRequests(MESSAGES.TOO_MANY_REQUESTS)),
});

module.exports = { authRateLimiter };
