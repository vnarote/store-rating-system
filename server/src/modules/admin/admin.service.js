const { User, Store, Rating } = require('../../models');
const userService = require('../users/user.service');
const storeService = require('../stores/store.service');
const ratingService = require('../ratings/rating.service');
const ApiError = require('../../utils/ApiError');
const { ROLES, ROLE_VALUES } = require('../../constants/roles');
const {
  parsePagination,
  parseSort,
  buildPagination,
  buildContainsWhere,
} = require('../../utils/pagination');

const USER_SORT_FIELDS = ['name', 'email', 'address', 'role', 'createdAt'];

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

const listUsers = async (query) => {
  const pagination = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(query, USER_SORT_FIELDS, 'createdAt', 'DESC');
  const where = buildContainsWhere(query, ['name', 'email', 'address']);

  if (query.role !== undefined && query.role !== '') {
    if (!ROLE_VALUES.includes(query.role)) {
      throw ApiError.badRequest(`role must be one of: ${ROLE_VALUES.join(', ')}`);
    }
    where.role = query.role;
  }

  const { rows, count } = await User.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return { items: rows.map((row) => row.toJSON()), pagination: buildPagination(pagination, count) };
};

const getUserDetails = async (id) => {
  const user = await userService.getUserById(id);
  const details = user.toJSON();

  // Store owners additionally expose their stores and overall rating.
  if (user.role === ROLES.STORE_OWNER) {
    const [stores, summary] = await Promise.all([
      storeService.listOwnerStores(id),
      ratingService.getOwnerRatingSummary(id),
    ]);
    details.stores = stores;
    details.rating = summary.averageRating;
    details.totalRatings = summary.totalRatings;
  }
  return details;
};

module.exports = { getDashboardStats, listUsers, getUserDetails };
