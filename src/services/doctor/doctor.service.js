import db from "../../models";
import { Label } from "../../utils/labels/label";
import Bcryptjs from "../../utils/auth/bcryptjs";
import { Op } from "sequelize";

const editDoctor = async (doctorInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Doctor.findOne({
        where: { id: doctorInfo.id },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
      });
      if (!doctor) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      let existEmail = await db.Doctor.findOne({
        where: {
          email: doctorInfo.email,
          id: { [Op.ne]: doctorInfo.id },
        },
      });
      if (existEmail) {
        resolve({
          message: Label.EXISTED_EMAIL,
          success: false,
        });
      } else {
        const newDoctor = await doctor.update(doctorInfo);
        await db.Doctor_Specialty.destroy({
          where: {
            doctorId: doctorInfo.id,
          },
        });
        const listDoctorspecialty = doctorInfo.specialtyData.map((item) => ({
          doctorId: doctorInfo.id,
          specialtyId: item.id,
        }));
        const listDoctorspecialtyUpdated = await db.Doctor_Specialty.bulkCreate(
          listDoctorspecialty
        );
        Promise.all(listDoctorspecialtyUpdated).then((data) => {
          resolve({
            message: Label.UPDATE_SUCCESS,
            success: true,
            data: doctor,
          });
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getDetail = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Doctor.findOne({
        where: { id: id },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Code,
            as: "provinceDoctorData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Specialty,
            as: "specialtyData",
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
          },
        ],
        nest: true,
        distinct: true,
      });

      if (!doctor) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      } else {
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: doctor,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const changePasswordDoctor = async (doctorInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.Doctor.findOne({
        where: { id: doctorInfo.id },
        raw: true,
      });
      let comparePassword = await Bcryptjs.comparePassword(
        doctorInfo.oldPassword,
        account.password
      );
      if (!comparePassword) {
        resolve({
          message: Label.WRONG_OLD_PASSWORD,
          success: false,
        });
      } else {
        let hashedNewPassword = await Bcryptjs.hashPassword(doctorInfo.newPassword);
        await db.Doctor.update(
          {
            password: hashedNewPassword,
          },
          {
            where: { id: doctorInfo.id },
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

module.exports = {
  getDetail: getDetail,
  editDoctor: editDoctor,
  changePasswordDoctor: changePasswordDoctor,
};
