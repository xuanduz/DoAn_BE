import db from "../../models";
import { deleteFile, uploadImage } from "../../utils/firebase-function";
import { Label } from "../../utils/labels/label";
import { getListData, getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const addNewSpecialty = async (specialtyData, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUrl = file ? await uploadImage(file) : "";
      const newSpecialty = await db.Specialty.create({
        name: specialtyData.name,
        image: imageUrl,
        descriptionHTML: specialtyData.descriptionHTML,
        describe: specialtyData.describe,
      });
      resolve({
        message: Label.CREATE_SPECIALTY_SUCCESS,
        success: true,
        data: newSpecialty,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getSpecialty = async (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialtyData = await db.Specialty.findOne({
        where: { id: specialtyId },
        raw: true,
      });
      let result = {};
      if (!specialtyData) {
        result = {
          message: Label.NOT_EXISTED_CLINIC,
          success: false,
        };
      } else {
        result = {
          message: Label.SUCCESS,
          success: true,
          data: specialtyData,
        };
      }
      resolve(result);
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const filterSpecialty = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, specialtyName } = filter;
      const { count, rows } = await db.Specialty.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        distinct: true,
        where: {
          name: {
            [Op.like]: `%${specialtyName ? specialtyName : ""}%`,
          },
        },
        // nest: true,
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

const editSpecialty = async (specialtyInfo, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: specialtyInfo.id },
      });
      if (!specialty) {
        resolve({
          message: Label.NOT_EXISTED_SPECIALTY,
          success: false,
        });
      } else {
        const imageUrl = file ? await uploadImage(file) : "";
        if (imageUrl) {
          const oldUrl = specialty.dataValues.image;
          if (oldUrl) {
            await deleteFile(oldUrl);
          }
        }
        const newSpecialty = await specialty.update({
          ...specialtyInfo,
          image: imageUrl,
        });
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: newSpecialty.dataValues,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteSpecialty = async (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialty = await db.Specialty.findOne({
        where: { id: specialtyId },
      });
      const oldUrl = specialty.dataValues.image;
      if (oldUrl) {
        await deleteFile(oldUrl);
      }
      await specialty.destroy();
      resolve({
        message: Label.DELETE_SUCCESS,
        success: true,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  addNewSpecialty: addNewSpecialty,
  getSpecialty: getSpecialty,
  filterSpecialty: filterSpecialty,
  editSpecialty: editSpecialty,
  deleteSpecialty: deleteSpecialty,
};
