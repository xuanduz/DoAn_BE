"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.hasMany(models.Appointment, {
        foreignKey: "patientId",
        as: "appointmentData",
      });
    }
  }
  Patient.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      birthday: DataTypes.DATE,
      phoneNumber: DataTypes.STRING,
      provinceKey: DataTypes.STRING,
      addressDetail: DataTypes.STRING,

      accessToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Patient",
      freezeTableName: true,
    }
  );
  return Patient;
};
