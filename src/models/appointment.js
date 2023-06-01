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
      Appointment.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        as: "clinicData",
      });
      Appointment.belongsTo(models.Code, {
        foreignKey: "statusKey",
        targetKey: "key",
        as: "statusData",
      });
      Appointment.belongsTo(models.Code, {
        foreignKey: "timeSlot",
        targetKey: "key",
        as: "timeData",
      });
      Appointment.belongsTo(models.Code, {
        foreignKey: "bookingType",
        targetKey: "key",
        as: "bookingData",
      });
    }
  }
  Appointment.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      statusKey: DataTypes.STRING,
      date: DataTypes.STRING,
      time: DataTypes.STRING,
      timeSlot: DataTypes.STRING,
      reason: DataTypes.STRING,
      bookingType: DataTypes.STRING,
      resultFile: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Appointment",
      freezeTableName: true,
    }
  );
  return Appointment;
};
