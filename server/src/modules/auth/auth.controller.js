const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const MESSAGES = require('../../constants/messages');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  ApiResponse.created(res, MESSAGES.REGISTER_SUCCESS, data);
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  ApiResponse.success(res, { message: MESSAGES.LOGIN_SUCCESS, data });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  ApiResponse.success(res, { data: { user } });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  ApiResponse.success(res, { message: MESSAGES.PASSWORD_CHANGED });
});

module.exports = { register, login, getMe, changePassword };
