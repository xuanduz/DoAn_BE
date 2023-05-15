import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");

const filterDoctor = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        pageNum,
        pageSize,
        doctorName,
        clinicId,
        specialtyId,
        minPrice,
        maxPrice,
      } = filter;

      const listDoctor = await db.Doctor.findAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          fullName: {
            [Op.like]: `%${doctorName ? doctorName : ""}%`,
          },
          price: {
            [Op.gte]: +minPrice,
            [Op.lte]: +maxPrice,
          },
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Schedule,
            as: "scheduleData",
            required: false,
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            required: false,
            where: {
              id: {
                [Op.like]: `%${specialtyId ? specialtyId : ""}%`,
              },
            },
          },
          {
            model: db.Clinic,
            as: "clinicData",
            required: false,
            where: {
              id: {
                [Op.like]: `%${clinicId ? clinicId : ""}%`,
              },
            },
          },
        ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listDoctor,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctorData = await db.Doctor.findOne({
        where: {
          id: doctorId,
        },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Schedule,
            as: "scheduleData",
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["descriptionHTML"],
            },
          },
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: {
              exclude: ["descriptionHTML"],
            },
          },
        ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: doctorData,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  filterDoctor: filterDoctor,
  getDoctor: getDoctor,
};
