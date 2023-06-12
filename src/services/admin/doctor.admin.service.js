import db from "../../models";
import Bcryptjs from "../../utils/auth/bcryptjs";
import { deleteFile, uploadImage } from "../../utils/firebase-function";
import { Label } from "../../utils/labels/label";
import { getListData, getPageAmount, getQueryWithId } from "../../utils/pagingData";
const { Op } = require("sequelize");

const addNewDoctor = async (data, file) => {
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
        const imageUrl = file ? await uploadImage(file) : "";
        const hashedPassword = await Bcryptjs.hashPassword(doctorData.password);
        const newDoctor = await db.Doctor.create({
          email: doctorData.email,
          password: hashedPassword,
          fullName: doctorData.fullName,
          gender: doctorData.gender,
          phoneNumber: doctorData.phoneNumber,
          image: imageUrl,
          price: doctorData.price,
          descriptionHTML: doctorData.descriptionHTML,
          describe: doctorData.describe,
          provinceKey: doctorData.provinceKey,
          positionKey: doctorData.positionKey,

          clinicId: doctorData.clinicId,
        });
        const specialtyData = JSON.parse(doctorData.specialtyData);
        if (specialtyData.length) {
          const listDoctorSpecialty = specialtyData.map((spec) => ({
            doctorId: newDoctor.id,
            specialtyId: spec.id,
          }));
          await db.Doctor_Specialty.bulkCreate(listDoctorSpecialty);
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
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
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

const getDoctorByClinic = async (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doctorsData = await db.Doctor.findAll({
        where: { clinicId: clinicId },
        raw: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: doctorsData,
      });
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
      db.Doctor.findAndCountAll({
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
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            ...getQueryWithId(specialtyId),
          },
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: {
              exclude: ["email", "createdAt", "updatedAt"],
            },
            ...getQueryWithId(clinicId),
          },
        ],
        nest: true,
        distinct: true,
      }).then(({ count, rows }) => {
        const listIds = rows.map((item) => item.id);
        const listDoctor = specialtyId
          ? listIds.map((id) =>
              db.Doctor.findOne({
                where: {
                  id: id,
                },
                attributes: {
                  exclude: ["password", "accessToken", "refreshToken"],
                },
                include: [
                  {
                    model: db.Specialty,
                    as: "specialtyData",
                    required: false,
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.Clinic,
                    as: "clinicData",
                    attributes: {
                      exclude: ["email", "createdAt", "updatedAt"],
                    },
                    ...getQueryWithId(clinicId),
                  },
                ],
                nest: true,
              })
            )
          : rows;
        Promise.all(listDoctor).then((data) => {
          resolve({
            message: Label.SUCCESS,
            success: true,
            data: data,
            pagination: {
              pageNum: getPageAmount(count, pageSize) < pageNum ? pageNum - 1 : pageNum,
              pageSize: pageSize,
              pageAmount: getPageAmount(count, pageSize),
              records: count,
            },
          });
        });
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
};

const editDoctor = async (doctorInfo, file) => {
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
      const imageUrl = file ? await uploadImage(file) : "";
      const specialtyData = doctorInfo.specialtyData ? JSON.parse(doctorInfo.specialtyData) : [];
      let listDoctorSpecialty = [];
      if (specialtyData.length) {
        listDoctorSpecialty = specialtyData.map((spec) => ({
          doctorId: doctorInfo.id,
          specialtyId: spec.id,
        }));
      }
      await db.Doctor_Specialty.destroy({
        where: {
          doctorId: doctorInfo.id,
        },
      });
      await db.Doctor_Specialty.bulkCreate(listDoctorSpecialty);
      if (imageUrl) {
        const oldUrl = doctor.dataValues.image;
        if (oldUrl) {
          await deleteFile(oldUrl);
        }
      }
      const newDoctor = await doctor.update({
        ...doctorInfo,
        image: imageUrl,
      });
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
      const doctor = await db.Doctor.findOne({
        where: { id: doctorId },
      });
      const oldUrl = doctor.dataValues.image;
      if (oldUrl) {
        await deleteFile(oldUrl);
      }
      await doctor.destroy();
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
  getDoctorByClinic: getDoctorByClinic,
};
