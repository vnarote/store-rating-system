const storeService = require('./store.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const listStores = asyncHandler(async (req, res) => {
  const data = await storeService.listStores({ query: req.query, userId: req.user.id });
  ApiResponse.success(res, { data });
});

const getStore = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById({ id: req.params.id, userId: req.user.id });
  ApiResponse.success(res, { data: { store } });
});

module.exports = { listStores, getStore };
