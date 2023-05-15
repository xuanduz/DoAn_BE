"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("doctor", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.BOOLEAN,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      descriptionHTML: {
        type: Sequelize.TEXT,
      },
      describe: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      provinceKey: {
        type: Sequelize.STRING,
      },
      positionKey: {
        type: Sequelize.STRING,
      },
      accessToken: {
        type: Sequelize.STRING,
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      clinicId: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("doctor");
  },
};
