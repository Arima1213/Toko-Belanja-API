'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          full_name: 'Admin User',
          email: 'admin@example.com',
          password:
            '$2b$10$eoCmHwfQYY7YhOUtIA3kZO4XhTUTZosxZbAoY6.MxEUvy7wqgHZk2',
          gender: 'male',
          role: 'admin',
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
