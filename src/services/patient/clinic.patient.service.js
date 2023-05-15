import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");

const filterClinic = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, clinicName, provinceKey } = filter;
      const listClinic = await db.Clinic.findAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          name: {
            [Op.like]: `%${clinicName ? clinicName : ""}%`,
          },
          provinceKey: {
            [Op.like]: `%${provinceKey ? provinceKey : ""}%`,
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
        data: listClinic,
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
      const clinic = await db.Clinic.findOne({
        where: {
          id: clinicId,
        },
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: clinic,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getAllClinic = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const clinics = await db.Clinic.findAll({
        attributes: {
          exclude: ["descriptionHTML", "describe", "createdAt", "updatedAt"],
        },
        // include: [
        //   {
        //     model: db.Code,
        //     as: "provinceData",
        //   },
        // ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: clinics,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  filterClinic: filterClinic,
  getClinic: getClinic,
  getAllClinic: getAllClinic,
};
