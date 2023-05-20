import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");

const filterSpecialty = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, specialtyName } = filter;
      const listSpecialty = await db.Specialty.findAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          name: {
            [Op.like]: `%${specialtyName ? specialtyName : ""}%`,
          },
        },
        attributes: {
          exclude: ["descriptionHTML"],
        },
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listSpecialty,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getAllSpecialty = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialties = await db.Specialty.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: specialties,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  filterSpecialty: filterSpecialty,
  getAllSpecialty: getAllSpecialty,
};
