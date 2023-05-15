"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      Clinic.hasMany(models.Doctor, {
        foreignKey: "clinicId",
        as: "doctorData",
      });
    }
  }
  Clinic.init(
    {
      name: DataTypes.STRING,
      provinceKey: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT,
      describe: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Clinic",
      freezeTableName: true,
    }
  );
  return Clinic;
};
