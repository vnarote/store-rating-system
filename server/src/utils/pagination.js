const { Op } = require('sequelize');
const ApiError = require('./ApiError');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const toPositiveInt = (value, fallback, field) => {
  if (value === undefined || value === '') return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw ApiError.badRequest(`${field} must be a positive integer`);
  }
  return number;
};

const parsePagination = (query) => {
  const page = toPositiveInt(query.page, 1, 'page');
  const limit = Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT, 'limit'), MAX_LIMIT);
  return { page, limit, offset: (page - 1) * limit };
};

// Sorting is restricted to an allow-list so user input never reaches ORDER BY unchecked.
const parseSort = (query, allowedFields, defaultField, defaultOrder = 'DESC') => {
  const sortBy = query.sortBy ?? defaultField;
  const sortOrder = String(query.sortOrder ?? defaultOrder).toUpperCase();

  if (!allowedFields.includes(sortBy)) {
    throw ApiError.badRequest(`sortBy must be one of: ${allowedFields.join(', ')}`);
  }
  if (!['ASC', 'DESC'].includes(sortOrder)) {
    throw ApiError.badRequest('sortOrder must be either asc or desc');
  }
  return { sortBy, sortOrder };
};

const buildPagination = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
});

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

// Builds a case-insensitive "contains" WHERE clause for the given text fields.
const buildContainsWhere = (query, fields) =>
  fields.reduce((where, field) => {
    const value = typeof query[field] === 'string' ? query[field].trim().slice(0, 100) : '';
    if (value) where[field] = { [Op.iLike]: `%${escapeLike(value)}%` };
    return where;
  }, {});

module.exports = { parsePagination, parseSort, buildPagination, buildContainsWhere };
