import db from "../../models";
import { Label } from "../../utils/labels/label";
import { getListData, getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const addNewClinic = async (clinicData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newClinic = await db.Clinic.create({
        email: clinicData.email,
        name: clinicData.name,
        address: clinicData.address,
        provinceKey: clinicData.provinceKey,
        image: clinicData.image,
        descriptionHTML: clinicData.descriptionHTML,
        describe: clinicData.describe,
      });
      resolve({
        message: Label.CREATE_CLINIC_SUCCESS,
        success: true,
        data: newClinic,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getClinic = async (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const clinicData = await db.Clinic.findOne({
        where: { id: clinicId },
        raw: true,
      });
      let result = {};
      if (!clinicData) {
        result = {
          message: Label.NOT_EXISTED_CLINIC,
          success: false,
        };
      } else {
        result = {
          message: Label.SUCCESS,
          success: true,
          data: clinicData,
        };
      }
      resolve(result);
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const filterClinic = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, clinicName, provinceKey } = filter;
      const { count, rows } = await db.Clinic.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        distinct: true,
        where: {
          name: {
            [Op.like]: `%${clinicName ? clinicName : ""}%`,
          },
        },
        include: [
          {
            model: db.Code,
            as: "provinceData",
            required: provinceKey ? true : false,
            where: {
              key: {
                [Op.like]: `%${provinceKey ? provinceKey : ""}%`,
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
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

const editClinic = async (clinicInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: clinicInfo.id },
      });
      if (!clinic) {
        resolve({
          message: Label.NOT_EXISTED_CLINIC,
          success: false,
        });
      }
      const newClinic = await clinic.update(clinicInfo);
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
        data: newClinic.dataValues,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteClinic = async (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Clinic.destroy({
        where: { id: clinicId },
      });
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
  addNewClinic: addNewClinic,
  getClinic: getClinic,
  filterClinic: filterClinic,
  editClinic: editClinic,
  deleteClinic: deleteClinic,
};
