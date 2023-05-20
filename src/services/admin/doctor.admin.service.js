import db from "../../models";
import Bcryptjs from "../../utils/auth/bcryptjs";
import { Label } from "../../utils/labels/label";
import { getListData, getPageAmount } from "../../utils/pagingData";
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

          clinicId: doctorData.clinicId,
        });
        if (doctorData.specialtyData.length) {
          doctorData.specialtyData.map(async (spec) => {
            await db.Doctor_Specialty.create({
              doctorId: newDoctor.id,
              specialtyId: spec.id,
            });
          });
        }
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
      if (!doctorData) {
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
      const { pageNum, pageSize, doctorName, clinicId, specialtyId } = filter;
      let { count, rows } = await db.Doctor.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          fullName: {
            [Op.like]: `%${doctorName ? doctorName : ""}%`,
          },
        },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Schedule,
            as: "scheduleData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            // where: {
            //   id: {
            //     [Op.like]: `%${specialtyId ? specialtyId : ""}%`,
            //   },
            // },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
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
            attributes: {
              exclude: ["email", "createdAt", "updatedAt"],
            },
          },
        ],
        nest: true,
        distinct: true,
      });
      let listDoctor = rows;
      if (specialtyId && listDoctor) {
        let temp = listDoctor;
        listDoctor = temp.filter((doctor) =>
          doctor.specialtyData.some((spec) => spec.id == specialtyId)
        );
      }
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listDoctor,
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

const editSpecialty = async (doctorInfo) => {
  const specialtiesExist = await db.Specialty.findAll({ raw: true });
  const specialtiesRequest = doctorInfo.specialtyData.map((spec) => ({
    id: spec.id,
    name: spec.name,
  }));
  const newSpecialties = specialtiesRequest.filter((specReq) =>
    specialtiesExist.includes((specExist) => specExist.id != specReq.id)
  );
  console.log("newSpecialties", specialtiesExist, specialtiesRequest, newSpecialties);
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
      const specialtiesRequest = doctorInfo.specialtyData.map((spec) => ({
        specialtyId: spec.id,
        doctorId: doctorInfo.id,
      }));

      await db.Doctor_Specialty.destroy({
        where: {
          doctorId: doctorInfo.id,
        },
      });
      await specialtiesRequest.map(async (doctor_spec) => {
        await db.Doctor_Specialty.create({
          doctorId: doctor_spec.doctorId,
          specialtyId: doctor_spec.specialtyId,
        });
      });
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
