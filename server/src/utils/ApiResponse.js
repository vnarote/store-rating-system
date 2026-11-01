const success = (
  res,
  { statusCode = 200, message = 'Operation completed successfully', data = {} } = {},
) => res.status(statusCode).json({ success: true, message, data });

const created = (res, message, data) => success(res, { statusCode: 201, message, data });

module.exports = { success, created };
