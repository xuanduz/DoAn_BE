"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic_Specialty extends Model {
    static associate(models) {
      // Clinic_Specialty.hasOne(models.Admin, {foreignKey: 'clinicId', as: 'clinicData'})
      // Clinic_Specialty.hasOne(models.Clinic, {foreignKey: 'clinicId', as: 'clinicData'})
      // Clinic_Specialty.hasOne(models.Specialty, {foreignKey: 'specialtyId', as: 'specialtyData'})
      // models.Admin.belongsToMany(models.Clinic, {through: Clinic_Specialty})
      // models.Clinic.belongsToMany(models.Admin, {through: Clinic_Specialty})
    }
  }
  Clinic_Specialty.init(
    {
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Clinic_Specialty",
      freezeTableName: true,
    }
  );
  return Clinic_Specialty;
};
