import db from "../../models";
import { Label } from "../../utils/labels/label";
import Bcryptjs from "../../utils/auth/bcryptjs";
const { Op } = require("sequelize");

const editAccount = async (patientInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let patient = await db.Patient.findOne({
        where: { id: patientInfo.id },
      });
      if (!patient) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      let existEmail = await db.Patient.findOne({
        where: {
          email: patientInfo.email,
          id: { [Op.ne]: patientInfo.id },
        },
      });
      if (existEmail) {
        resolve({
          message: Label.EXISTED_EMAIL,
          success: false,
        });
      } else {
        const newPatient = await patient.update(patientInfo);
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: newPatient.dataValues,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getPatient = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let patient = await db.Patient.findOne({
        where: { id: id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Code,
            as: "provincePatientData",
            attributes: {
              exclude: ["updatedAt", "createdAt"],
            },
          },
        ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: patient,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const changePassword = async (patientInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.Patient.findOne({
        where: { email: patientInfo.email },
        raw: true,
      });
      let comparePassword = await Bcryptjs.comparePassword(
        patientInfo.oldPassword,
        account.password
      );
      if (!comparePassword) {
        resolve({
          message: Label.WRONG_PASSWORD,
          success: false,
        });
      } else {
        let hashedNewPassword = await Bcryptjs.hashPassword(patientInfo.newPassword);
        await db.Patient.update(
          {
            password: hashedNewPassword,
          },
          {
            where: { email: patientInfo.email },
          }
        );
        resolve({
          message: Label.CHANGE_PASSWORD_SUCCESS,
          success: true,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getAllProvince = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let provinces = await db.Code.findAll({
        where: {
          type: "PROVINCE",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        raw: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: provinces,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getAllPosition = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let positions = await db.Code.findAll({
        where: {
          type: "POSITION",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        raw: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: positions,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  editAccount: editAccount,
  getPatient: getPatient,
  changePassword: changePassword,
  getAllProvince: getAllProvince,
  getAllPosition: getAllPosition,
};
