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
      Schedule.belongsTo(models.Code, {
        foreignKey: "timeSlot",
        targetKey: "key",
        as: "timeData",
      });
    }
  }
  Schedule.init(
    {
      date: DataTypes.STRING,
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
