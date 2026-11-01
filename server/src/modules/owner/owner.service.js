const { Rating, Store, User } = require('../../models');
const storeService = require('../stores/store.service');
const ratingService = require('../ratings/rating.service');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');
const { parsePagination, parseSort, buildPagination } = require('../../utils/pagination');

const RATING_SORT = {
  createdAt: ['createdAt'],
  rating: ['rating'],
  userName: [{ model: User, as: 'user' }, 'name'],
  storeName: [{ model: Store, as: 'store' }, 'name'],
};

const getStores = (ownerId) => storeService.listOwnerStores(ownerId);

const getDashboard = async (ownerId) => {
  const [stores, summary] = await Promise.all([
    storeService.listOwnerStores(ownerId),
    ratingService.getOwnerRatingSummary(ownerId),
  ]);
  return { stores, ...summary };
};

const listRatings = async ({ ownerId, query }) => {
  const pagination = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, Object.keys(RATING_SORT), 'createdAt', 'DESC');

  // Only ratings of stores owned by the authenticated owner are ever queried.
  const ownedStores = await Store.findAll({ where: { ownerId }, attributes: ['id'] });
  const ownedIds = ownedStores.map((store) => store.id);

  let storeIds = ownedIds;
  if (query.storeId) {
    if (!ownedIds.includes(query.storeId)) throw ApiError.forbidden(MESSAGES.STORE_ACCESS_FORBIDDEN);
    storeIds = [query.storeId];
  }

  if (storeIds.length === 0) {
    return { items: [], pagination: buildPagination(pagination, 0) };
  }

  const { rows, count } = await Rating.findAndCountAll({
    where: { storeId: storeIds },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Store, as: 'store', attributes: ['id', 'name'] },
    ],
    order: [[...RATING_SORT[sortBy], sortOrder]],
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return { items: rows.map((row) => row.toJSON()), pagination: buildPagination(pagination, count) };
};

module.exports = { getStores, getDashboard, listRatings };
