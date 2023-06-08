"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      Specialty.belongsToMany(models.Doctor, {
        through: "doctor_specialty",
        foreignKey: "specialtyId",
        as: "doctorData",
        // otherKey: "doctorId",
      });
      Specialty.belongsToMany(models.Clinic, {
        through: "clinic_specialty",
        foreignKey: "specialtyId",
        as: "clinicData",
        // otherKey: "doctorId",
      });
    }
  }
  Specialty.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      describe: DataTypes.STRING,
      descriptionHTML: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
      freezeTableName: true,
    }
  );
  return Specialty;
};
