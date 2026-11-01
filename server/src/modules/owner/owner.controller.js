const ownerService = require('./owner.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await ownerService.getDashboard(req.user.id);
  ApiResponse.success(res, { data });
});

const getStores = asyncHandler(async (req, res) => {
  const stores = await ownerService.getStores(req.user.id);
  ApiResponse.success(res, { data: { stores } });
});

const listRatings = asyncHandler(async (req, res) => {
  const data = await ownerService.listRatings({ ownerId: req.user.id, query: req.query });
  ApiResponse.success(res, { data });
});

module.exports = { getDashboard, getStores, listRatings };
