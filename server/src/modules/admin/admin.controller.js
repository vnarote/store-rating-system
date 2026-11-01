const adminService = require('./admin.service');
const userService = require('../users/user.service');
const storeService = require('../stores/store.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getDashboard = asyncHandler(async (_req, res) => {
  const stats = await adminService.getDashboardStats();
  ApiResponse.success(res, { data: stats });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  ApiResponse.created(res, 'User created successfully', { user });
});

const listUsers = asyncHandler(async (req, res) => {
  const data = await adminService.listUsers(req.query);
  ApiResponse.success(res, { data });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUserDetails(req.params.id);
  ApiResponse.success(res, { data: { user } });
});

const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.body);
  ApiResponse.created(res, 'Store created successfully', { store });
});

const listStores = asyncHandler(async (req, res) => {
  const data = await storeService.listStores({ query: req.query, isAdmin: true });
  ApiResponse.success(res, { data });
});

const getStore = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById({ id: req.params.id, isAdmin: true });
  ApiResponse.success(res, { data: { store } });
});

module.exports = { getDashboard, createUser, listUsers, getUser, createStore, listStores, getStore };
