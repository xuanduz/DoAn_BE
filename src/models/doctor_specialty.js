"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Specialty extends Model {
    static associate(models) {
      // Doctor_Specialty.hasOne(models.Admin, {foreignKey: 'doctorId', as: 'doctorData'})
      // Doctor_Specialty.hasOne(models.Clinic, {foreignKey: 'clinicId', as: 'clinicData'})
      // Doctor_Specialty.hasOne(models.Specialty, {foreignKey: 'specialtyId', as: 'specialtyData'})
      // models.Admin.belongsToMany(models.Clinic, {through: Doctor_Specialty})
      // models.Clinic.belongsToMany(models.Admin, {through: Doctor_Specialty})
    }
  }
  Doctor_Specialty.init(
    {
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Specialty",
      freezeTableName: true,
    }
  );
  return Doctor_Specialty;
};
