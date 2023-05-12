'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'buckyNV@gmail.com',
      password: '123456',
      firstName: 'Bucky',
      lastName: 'Nguyen',
      address : 'Bac Ninh',
      gender: 1,
      roleId: 1,
      phonenumber: '0834588225',
      positionId: 'P0',
      image: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
