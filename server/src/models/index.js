const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/environment');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const db = {
  sequelize,
  Sequelize,
  User: require('./user.model')(sequelize, DataTypes),
  Store: require('./store.model')(sequelize, DataTypes),
  Rating: require('./rating.model')(sequelize, DataTypes),
};

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(db);
});

module.exports = db;
