"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Code extends Model {
    static associate(models) {
      // define association here
    }
  }
  Code.init(
    {
      key: DataTypes.STRING,
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
