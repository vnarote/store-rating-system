// Exported per environment so both sequelize-cli and the app read the same settings.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  define: { timestamps: true },
};

module.exports = {
  development: { ...base, logging: false },
  test: { ...base, database: `${process.env.DB_NAME}_test`, logging: false },
  production: { ...base, logging: false },
};
