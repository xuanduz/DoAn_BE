"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctor",
      });
    }
  }
  Schedule.init(
    {
      date: DataTypes.DATE,
      timeSlot: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      currentNumber: DataTypes.INTEGER,
      maxNumber: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule",
      freezeTableName: true,
    }
  );
  return Schedule;
};
