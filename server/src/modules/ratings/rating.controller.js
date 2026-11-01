const ratingService = require('./rating.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

const submitRating = asyncHandler(async (req, res) => {
  const data = await ratingService.submitRating({
    userId: req.user.id,
    storeId: req.body.storeId,
    rating: req.body.rating,
  });
  ApiResponse.created(res, 'Rating submitted successfully', data);
});

const updateRating = asyncHandler(async (req, res) => {
  const data = await ratingService.updateRating({
    userId: req.user.id,
    ratingId: req.params.id,
    rating: req.body.rating,
  });
  ApiResponse.success(res, { message: 'Rating updated successfully', data });
});

const listMyRatings = asyncHandler(async (req, res) => {
  const data = await ratingService.listMyRatings({ userId: req.user.id, query: req.query });
  ApiResponse.success(res, { data });
});

module.exports = { submitRating, updateRating, listMyRatings };
