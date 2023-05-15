import db from "../../models";
import Bcryptjs from "../../utils/auth/bcryptjs";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");

const addNewDoctor = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctorData = data;
      const checkExisted = await db.Doctor.findOne({
        where: { email: doctorData.email },
        raw: true,
      });
      let result = {};
      if (checkExisted) {
        result = {
          message: Label.EXISTED_EMAIL,
          success: false,
        };
      } else {
        const hashedPassword = await Bcryptjs.hashPassword(doctorData.password);
        const newDoctor = await db.Doctor.create({
          email: doctorData.email,
          password: hashedPassword,
          fullName: doctorData.fullName,
          gender: doctorData.gender,
          phoneNumber: doctorData.phoneNumber,
          image: doctorData.image,
          price: doctorData.price,
          descriptionHTML: doctorData.descriptionHTML,
          describe: doctorData.describe,
          provinceKey: doctorData.provinceKey,
          positionKey: doctorData.positionKey,
        });
        result = {
          message: Label.CREATE_ACCOUNT_SUCCESS,
          success: true,
          data: newDoctor,
        };
      }
      resolve(result);
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
        where: { id: doctorId },
        raw: true,
      });
      let result = {};
      if (doctorData) {
        result = {
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        };
      } else {
        result = {
          message: Label.SUCCESS,
          success: true,
          data: doctorData,
        };
      }
      resolve(result);
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const filterDoctor = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      // "pageNum": 1,
      // "pageSize": 9,
      // "doctorName": null,
      // "clincis": null,
      // "specialists": null
      const { pageNum, pageSize, doctorName, clinicId, specialtyId } = filter;
      const listDoctor = await db.Doctor.findAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          fullName: {
            [Op.like]: `%${doctorName ? doctorName : ""}%`,
          },
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
            where: {
              id: {
                [Op.like]: `%${specialtyId ? specialtyId : ""}%`,
              },
            },
          },
          {
            model: db.Clinic,
            as: "clinicData",
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

const editDoctor = async (doctorInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Doctor.findOne({
        where: { id: doctorInfo.id },
      });
      if (!doctor) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      const newDoctor = await doctor.update(doctorInfo);
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
        data: newDoctor.dataValues,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Doctor.destroy({
        where: { id: doctorId },
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
  addNewDoctor: addNewDoctor,
  getDoctor: getDoctor,
  filterDoctor: filterDoctor,
  editDoctor: editDoctor,
  deleteDoctor: deleteDoctor,
};
