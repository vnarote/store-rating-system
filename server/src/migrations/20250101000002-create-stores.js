'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stores', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(60), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING(400), allowNull: false },
      // RESTRICT: an owner with stores cannot be deleted by accident.
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addIndex('stores', ['ownerId'], { name: 'stores_owner_idx' });
    await queryInterface.addIndex('stores', ['name'], { name: 'stores_name_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stores');
  },
};
