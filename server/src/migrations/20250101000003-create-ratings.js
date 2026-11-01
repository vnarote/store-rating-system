'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      // CASCADE: ratings are meaningless without their user or store.
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      storeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex('ratings', ['userId', 'storeId'], {
      unique: true,
      name: 'ratings_user_store_unique',
    });
    await queryInterface.addIndex('ratings', ['storeId'], { name: 'ratings_store_idx' });
    await queryInterface.sequelize.query(
      'ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rating_range" CHECK ("rating" BETWEEN 1 AND 5);',
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ratings');
  },
};
