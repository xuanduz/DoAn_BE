import db from "../../models";
import { Label } from "../../utils/labels/label";
import { getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const filterClinic = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, clinicName, provinceKey } = filter;
      const { count, rows } = await db.Clinic.findAndCountAll({
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
        include: [
          {
            model: db.Code,
            as: "provinceData",
            // require: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
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

const filterFeaturedClinic = async (filter) => {
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
        include: [
          {
            model: db.Doctor,
            as: "doctorData",
            offset: 0,
            limit: 6,
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "accessToken", "refreshToken"],
            },
            include: [
              {
                model: db.Code,
                as: "positionData",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: {
                  exclude: ["descriptionHTML", "createdAt", "updatedAt"],
                },
                required: false,
              },
            ],
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["descriptionHTML", "createdAt", "updatedAt"],
            },
            required: false,
          },
        ],
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

const getClinicByProvince = async (provinceKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const clinic = await db.Clinic.findAll({
        where: {
          provinceKey: provinceKey,
        },
        attributes: {
          exclude: ["email", "describe", "descriptionHTML"],
        },
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
  getClinicByProvince: getClinicByProvince,
  filterFeaturedClinic: filterFeaturedClinic,
};
