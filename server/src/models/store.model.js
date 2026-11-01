module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    'Store',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(60), allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
      address: { type: DataTypes.STRING(400), allowNull: false },
      ownerId: { type: DataTypes.UUID, allowNull: false },
    },
    { tableName: 'stores' },
  );

  Store.associate = (models) => {
    Store.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    Store.hasMany(models.Rating, { foreignKey: 'storeId', as: 'ratings' });
  };

  return Store;
};
