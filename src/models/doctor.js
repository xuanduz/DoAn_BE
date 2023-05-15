"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        as: "clinicData",
      });
      Doctor.belongsToMany(models.Specialty, {
        through: "doctor_specialty",
        foreignKey: "doctorId",
        as: "specialtyData",
        // otherKey: "specialtyId",
      });
      Doctor.hasMany(models.Schedule, {
        foreignKey: "doctorId",
        as: "scheduleData",
      });
      Doctor.hasMany(models.Appointment, {
        foreignKey: "doctorId",
        as: "appointmentData",
      });
    }
  }
  Doctor.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      phoneNumber: DataTypes.STRING,
      image: DataTypes.STRING,
      descriptionHTML: DataTypes.TEXT,
      describe: DataTypes.STRING,
      addressDetail: DataTypes.STRING,
      provinceKey: DataTypes.STRING,
      positionKey: DataTypes.STRING,
      price: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,

      accessToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Doctor",
      freezeTableName: true,
    }
  );
  return Doctor;
};
