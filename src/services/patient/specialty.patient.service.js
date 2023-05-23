import db from "../../models";
import { Label } from "../../utils/labels/label";
import { getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const filterSpecialty = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, specialtyName } = filter;
      const { count, rows } = await db.Specialty.findAndCountAll({
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
        data: rows,
        pagination: {
          pageNum: getPageAmount(count, pageSize) < pageNum ? pageNum - 1 : pageNum,
          pageSize: pageSize,
          pageAmount: getPageAmount(count, pageSize),
          records: count,
        },
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

const getSpecialty = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialty = await db.Specialty.findOne({
        where: {
          id: id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: specialty,
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
  getSpecialty: getSpecialty,
};
