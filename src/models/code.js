"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Code extends Model {
    static associate(models) {
      Code.hasMany(models.Clinic, {
        foreignKey: "provinceKey",
        targetKey: "key",
        as: "provinceData",
      });
      Code.hasMany(models.Schedule, {
        foreignKey: "timeSlot",
        targetKey: "key",
        as: "timeScheduleData",
      });
      Code.hasMany(models.Patient, {
        foreignKey: "provinceKey",
        targetKey: "key",
        as: "provincePatientData",
      });
      Code.hasMany(models.Appointment, {
        foreignKey: "statusKey",
        targetKey: "key",
        as: "statusData",
      });
      Code.hasMany(models.Appointment, {
        foreignKey: "timeSlot",
        targetKey: "key",
        as: "timeAppointmentData",
      });
      Code.hasMany(models.Appointment, {
        foreignKey: "bookingType",
        targetKey: "key",
        as: "bookingData",
      });
      Code.hasMany(models.Doctor, {
        foreignKey: "positionKey",
        targetKey: "key",
        as: "positionData",
      });
      Code.hasMany(models.Doctor, {
        foreignKey: "provinceKey",
        targetKey: "key",
        as: "provinceDoctorData",
      });
    }
  }
  Code.init(
    {
      key: {
        type: DataTypes.STRING,
        unique: true,
      },
      type: DataTypes.STRING,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Code",
      freezeTableName: true,
    }
  );
  return Code;
};
