module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      storeId: { type: DataTypes.UUID, allowNull: false },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { isInt: true, min: 1, max: 5 },
      },
    },
    {
      tableName: 'ratings',
      // One rating per user per store, enforced by the database as well as the service layer.
      indexes: [{ unique: true, fields: ['userId', 'storeId'], name: 'ratings_user_store_unique' }],
    },
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Rating.belongsTo(models.Store, { foreignKey: 'storeId', as: 'store' });
  };

  return Rating;
};
