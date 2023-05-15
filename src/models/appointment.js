"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, {
        foreignKey: "patientId",
        as: "patientData",
      });
      Appointment.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
    }
  }
  Appointment.init(
    {
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      statusKey: DataTypes.STRING,
      date: DataTypes.DATE,
      timeSlot: DataTypes.STRING,
      reason: DataTypes.STRING,
      bookingType: DataTypes.STRING,
      resultFile: DataTypes.BLOB("long"),
    },
    {
      sequelize,
      modelName: "Appointment",
      freezeTableName: true,
    }
  );
  return Appointment;
};
