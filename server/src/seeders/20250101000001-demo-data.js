'use strict';

const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const ids = {
  admin: randomUUID(),
  user1: randomUUID(),
  user2: randomUUID(),
  owner1: randomUUID(),
  owner2: randomUUID(),
  store1: randomUUID(),
  store2: randomUUID(),
  store3: randomUUID(),
};

const SEEDED_EMAILS = [
  'admin@storerating.com',
  'user1@storerating.com',
  'user2@storerating.com',
  'owner1@storerating.com',
  'owner2@storerating.com',
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hash = (plain) => bcrypt.hash(plain, 10);
    const [adminPw, userPw, ownerPw] = await Promise.all([
      hash('Admin@1234'),
      hash('User@1234'),
      hash('Owner@1234'),
    ]);

    const timestamps = { createdAt: now, updatedAt: now };

    await queryInterface.bulkInsert('users', [
      { id: ids.admin, name: 'System Administrator Account', email: SEEDED_EMAILS[0], password: adminPw, address: '1 Admin Street, Pune, Maharashtra', role: 'SYSTEM_ADMIN', ...timestamps },
      { id: ids.user1, name: 'Normal User Account Number One', email: SEEDED_EMAILS[1], password: userPw, address: '22 Park Avenue, Mumbai, Maharashtra', role: 'NORMAL_USER', ...timestamps },
      { id: ids.user2, name: 'Normal User Account Number Two', email: SEEDED_EMAILS[2], password: userPw, address: '45 Lake Road, Nagpur, Maharashtra', role: 'NORMAL_USER', ...timestamps },
      { id: ids.owner1, name: 'Store Owner Account Number One', email: SEEDED_EMAILS[3], password: ownerPw, address: '7 Market Lane, Pune, Maharashtra', role: 'STORE_OWNER', ...timestamps },
      { id: ids.owner2, name: 'Store Owner Account Number Two', email: SEEDED_EMAILS[4], password: ownerPw, address: '9 Station Road, Nashik, Maharashtra', role: 'STORE_OWNER', ...timestamps },
    ]);

    await queryInterface.bulkInsert('stores', [
      { id: ids.store1, name: 'Green Valley Supermarket Plaza', email: 'contact@greenvalley.com', address: '101 Green Valley Road, Pune, Maharashtra', ownerId: ids.owner1, ...timestamps },
      { id: ids.store2, name: 'Sunrise Electronics Hub Mumbai', email: 'hello@sunriseelectronics.com', address: '55 Sunrise Complex, Mumbai, Maharashtra', ownerId: ids.owner1, ...timestamps },
      { id: ids.store3, name: 'Blue Lagoon Coffee House Cafe', email: 'brew@bluelagoon.com', address: '12 Lagoon Street, Nashik, Maharashtra', ownerId: ids.owner2, ...timestamps },
    ]);

    await queryInterface.bulkInsert('ratings', [
      { id: randomUUID(), userId: ids.user1, storeId: ids.store1, rating: 5, ...timestamps },
      { id: randomUUID(), userId: ids.user1, storeId: ids.store2, rating: 4, ...timestamps },
      { id: randomUUID(), userId: ids.user2, storeId: ids.store1, rating: 3, ...timestamps },
      { id: randomUUID(), userId: ids.user2, storeId: ids.store3, rating: 4, ...timestamps },
    ]);
  },

  async down(queryInterface) {
    const { Op } = queryInterface.sequelize.Sequelize;
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "users" WHERE email IN (:emails)',
      { replacements: { emails: SEEDED_EMAILS }, type: 'SELECT' },
    );
    const userIds = users.map((user) => user.id);
    if (userIds.length === 0) return;

    await queryInterface.bulkDelete('ratings', { userId: { [Op.in]: userIds } });
    await queryInterface.bulkDelete('stores', { ownerId: { [Op.in]: userIds } });
    await queryInterface.bulkDelete('users', { id: { [Op.in]: userIds } });
  },
};
