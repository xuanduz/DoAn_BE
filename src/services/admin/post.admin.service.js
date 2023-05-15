import db from "../../models";
import { Label } from "../../utils/labels/label";

const checkExistDoctor = async (doctorData) => {
  try {
    let checkExist = await db.Doctor.findOne({
      where: { id: doctorData.id },
    });
    if (checkExist) {
      return true;
    }
    return false;
  } catch (err) {
    console.log("err ", err);
  }
};

const updateDoctorPost = async (data) => {
  return new Promise(async (resolve, reject) => {
    const doctorData = data.doctor;
    try {
      if (!checkExistDoctor(doctorData)) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      await db.Doctor.update(
        {
          descriptionHTML: doctorData.descriptionHTML,
        },
        { where: { id: doctorData.id } }
      );
      const doctorUpdated = await db.Doctor.findOne({
        where: { id: doctorData.id },
      });
      resolve({
        message: Label.UPDATE_SUCCESS,
        data: doctorUpdated,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteDoctorPost = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!checkExistDoctor({ id: doctorId })) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      await db.Doctor.update(
        {
          descriptionHTML: null,
        },
        { where: { id: doctorId } }
      );
      const doctorUpdated = await db.Doctor.findOne({
        where: { id: doctorId },
      });
      resolve({
        message: Label.DELETE_POST_SUCCESS,
        data: doctorUpdated,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  updateDoctorPost: updateDoctorPost,
  deleteDoctorPost: deleteDoctorPost,
};
