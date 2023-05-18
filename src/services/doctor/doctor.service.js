import db from "../../models";
import { Label } from "../../utils/labels/label";
import Bcryptjs from "../../utils/auth/bcryptjs";

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
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: newDoctor.dataValues,
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
          message: Label.WRONG_PASSWORD,
          success: false,
        });
      } else {
        let hashedNewPassword = await Bcryptjs.hashPassword(
          doctorInfo.newPassword
        );
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
  editDoctor: editDoctor,
  changePasswordDoctor: changePasswordDoctor,
};
