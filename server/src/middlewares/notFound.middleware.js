const ApiError = require('../utils/ApiError');
const MESSAGES = require('../constants/messages');

const notFound = (req, _res, next) =>
  next(ApiError.notFound(`${MESSAGES.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`));

module.exports = notFound;
