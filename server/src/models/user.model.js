const { ROLE_VALUES, ROLES } = require('../constants/roles');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(60), allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(value) {
          this.setDataValue('email', String(value).trim().toLowerCase());
        },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING(400), allowNull: true },
      role: {
        type: DataTypes.ENUM(...ROLE_VALUES),
        allowNull: false,
        defaultValue: ROLES.NORMAL_USER,
      },
    },
    {
      tableName: 'users',
      // The password hash is never selected unless explicitly requested.
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: {} },
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Store, { foreignKey: 'ownerId', as: 'stores' });
    User.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings' });
  };

  return User;
};
