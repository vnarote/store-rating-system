const { fn, col } = require('sequelize');
const { Rating, Store } = require('../../models');
const storeService = require('../stores/store.service');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');
const {
  parsePagination,
  parseSort,
  buildPagination,
} = require('../../utils/pagination');

const MY_RATING_SORT = {
  updatedAt: ['updatedAt'],
  createdAt: ['createdAt'],
  rating: ['rating'],
  storeName: [{ model: Store, as: 'store' }, 'name'],
};

const withStore = async (rating, userId) => ({
  rating: rating.toJSON(),
  store: await storeService.getStoreById({ id: rating.storeId, userId }),
});

const submitRating = async ({ userId, storeId, rating }) => {
  const store = await Store.findByPk(storeId, { attributes: ['id'] });
  if (!store) throw ApiError.notFound(MESSAGES.STORE_NOT_FOUND);

  const existing = await Rating.findOne({ where: { userId, storeId } });
  if (existing) throw ApiError.conflict(MESSAGES.RATING_EXISTS, [{ ratingId: existing.id }]);

  // The unique index (userId, storeId) is the final guard against concurrent duplicates.
  const created = await Rating.create({ userId, storeId, rating });
  return withStore(created, userId);
};

const updateRating = async ({ userId, ratingId, rating }) => {
  const existing = await Rating.findByPk(ratingId);
  if (!existing) throw ApiError.notFound(MESSAGES.RATING_NOT_FOUND);
  if (existing.userId !== userId) throw ApiError.forbidden(MESSAGES.RATING_FORBIDDEN);

  existing.rating = rating;
  await existing.save();
  return withStore(existing, userId);
};

const listMyRatings = async ({ userId, query }) => {
  const pagination = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, Object.keys(MY_RATING_SORT), 'updatedAt', 'DESC');

  const { rows, count } = await Rating.findAndCountAll({
    where: { userId },
    include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'address'] }],
    order: [[...MY_RATING_SORT[sortBy], sortOrder]],
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return { items: rows.map((row) => row.toJSON()), pagination: buildPagination(pagination, count) };
};

// Average and count of all ratings received by every store the given owner owns.
const getOwnerRatingSummary = async (ownerId) => {
  const row = await Rating.findOne({
    attributes: [
      [fn('AVG', col('Rating.rating')), 'average'],
      [fn('COUNT', col('Rating.id')), 'total'],
    ],
    include: [{ model: Store, as: 'store', attributes: [], where: { ownerId }, required: true }],
    raw: true,
  });

  return {
    averageRating: row?.average ? Number(Number(row.average).toFixed(1)) : null,
    totalRatings: Number(row?.total ?? 0),
  };
};

module.exports = { submitRating, updateRating, listMyRatings, getOwnerRatingSummary };
