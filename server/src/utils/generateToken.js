const jwt = require('jsonwebtoken');
const env = require('../config/environment');

// Payload is intentionally minimal: the role is re-read from the database on every request.
const generateToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

module.exports = generateToken;
