const { literal } = require('sequelize');
const { Store, User, sequelize } = require('../../models');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');
const { ROLES } = require('../../constants/roles');
const {
  parsePagination,
  parseSort,
  buildPagination,
  buildContainsWhere,
} = require('../../utils/pagination');

// Ratings are aggregated on read so the average can never drift out of date.
const AVERAGE_SQL = `(SELECT ROUND(AVG(r."rating")::numeric, 1) FROM "ratings" AS r WHERE r."storeId" = "Store"."id")`;
const COUNT_SQL = `(SELECT COUNT(*) FROM "ratings" AS r WHERE r."storeId" = "Store"."id")`;

const USER_SORT_FIELDS = ['name', 'address', 'averageRating', 'createdAt'];
const ADMIN_SORT_FIELDS = ['name', 'email', 'address', 'averageRating', 'createdAt'];

const buildAttributes = ({ userId, isAdmin }) => {
  const attributes = [
    'id',
    'name',
    'address',
    'createdAt',
    [literal(AVERAGE_SQL), 'averageRating'],
    [literal(COUNT_SQL), 'ratingCount'],
  ];
  if (isAdmin) attributes.push('email', 'ownerId', 'updatedAt');
  if (userId) {
    const escapedUserId = sequelize.escape(userId);
    const mine = (column) =>
      `(SELECT m."${column}" FROM "ratings" AS m WHERE m."storeId" = "Store"."id" AND m."userId" = ${escapedUserId})`;
    attributes.push([literal(mine('rating')), 'myRating'], [literal(mine('id')), 'myRatingId']);
  }
  return attributes;
};

const formatStore = (store) => {
  const data = store.toJSON();
  const formatted = {
    ...data,
    averageRating: data.averageRating === null ? null : Number(data.averageRating),
    ratingCount: Number(data.ratingCount),
  };
  if ('myRating' in data) {
    formatted.myRating = data.myRating ?? null;
    formatted.myRatingId = data.myRatingId ?? null;
  }
  return formatted;
};

const buildOrder = (sortBy, sortOrder) =>
  sortBy === 'averageRating'
    ? [[literal('"averageRating"'), `${sortOrder} NULLS LAST`], ['name', 'ASC']]
    : [[sortBy, sortOrder]];

const listStores = async ({ query, userId = null, isAdmin = false }) => {
  const pagination = parsePagination(query);
  const { sortBy, sortOrder } = parseSort(
    query,
    isAdmin ? ADMIN_SORT_FIELDS : USER_SORT_FIELDS,
    'name',
    'ASC',
  );
  const where = buildContainsWhere(query, isAdmin ? ['name', 'email', 'address'] : ['name', 'address']);

  const { rows, count } = await Store.findAndCountAll({
    where,
    attributes: buildAttributes({ userId, isAdmin }),
    order: buildOrder(sortBy, sortOrder),
    limit: pagination.limit,
    offset: pagination.offset,
  });

  return { items: rows.map(formatStore), pagination: buildPagination(pagination, count) };
};

const getStoreById = async ({ id, userId = null, isAdmin = false }) => {
  const store = await Store.findByPk(id, {
    attributes: buildAttributes({ userId, isAdmin }),
    include: isAdmin ? [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }] : [],
  });
  if (!store) throw ApiError.notFound(MESSAGES.STORE_NOT_FOUND);
  return formatStore(store);
};

const listOwnerStores = async (ownerId) => {
  const stores = await Store.findAll({
    where: { ownerId },
    attributes: buildAttributes({ isAdmin: true }),
    order: [['name', 'ASC']],
  });
  return stores.map(formatStore);
};

const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await User.findByPk(ownerId);
  if (!owner) throw ApiError.notFound(MESSAGES.USER_NOT_FOUND);
  if (owner.role !== ROLES.STORE_OWNER) throw ApiError.badRequest(MESSAGES.NOT_STORE_OWNER);

  const store = await Store.create({ name, email, address, ownerId });
  return getStoreById({ id: store.id, isAdmin: true });
};

module.exports = { listStores, getStoreById, listOwnerStores, createStore };
