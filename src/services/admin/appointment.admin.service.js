import db from "../../models";
import { deleteFile } from "../../utils/firebase-function";
import { Label } from "../../utils/labels/label";
import { getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const getAppointmentDetail = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointment = await db.Appointment.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: db.Patient,
            as: "patientData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "accessToken", "refreshToken"],
            },
            include: [
              {
                model: db.Code,
                as: "provincePatientData",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: db.Code,
            as: "timeData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Code,
            as: "statusData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Code,
            as: "bookingData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Doctor,
            as: "doctorData",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "password",
                "accessToken",
                "refreshToken",
                "describe",
                "descriptionHTML",
              ],
            },
            include: [
              {
                model: db.Clinic,
                as: "clinicData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "descriptionHTML", "describe"],
                },
              },
            ],
          },
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "descriptionHTML", "describe"],
            },
          },
        ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: appointment,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const filterAppointment = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, orderBy, patientName, provinceKey, statusKey, bookingType, date } =
        filter;
      const { count, rows } = await db.Appointment.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        distinct: true,
        order: [["createdAt", orderBy || "DESC"]],
        where: {
          statusKey: {
            [Op.like]: `%${statusKey ? statusKey : ""}%`,
          },
          date: {
            [Op.like]: `%${date ? date : ""}%`,
          },
        },
        include: [
          {
            model: db.Patient,
            as: "patientData",
            where: {
              fullName: {
                [Op.like]: `%${patientName ? patientName : ""}%`,
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "accessToken", "refreshToken"],
            },
            include: [
              {
                model: db.Code,
                as: "provincePatientData",
                where: {
                  key: {
                    [Op.like]: `%${provinceKey ? provinceKey : ""}%`,
                  },
                },
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: db.Code,
            as: "timeData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Code,
            as: "statusData",
            where: {
              key: {
                [Op.like]: `%${statusKey ? statusKey : ""}%`,
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Code,
            as: "bookingData",
            where: {
              key: {
                [Op.like]: `%${bookingType ? bookingType : ""}%`,
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          // {
          //   model: db.Doctor,
          //   as: "doctorData",
          //   attributes: {
          //     exclude: [
          //       "createdAt",
          //       "updatedAt",
          //       "password",
          //       "accessToken",
          //       "refreshToken",
          //       "describe",
          //       "descriptionHTML",
          //     ],
          //   },
          // },
        ],
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

const editAppointment = async (appointmentInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let appointment = await db.Appointment.findOne({
        where: { id: appointmentInfo.id },
      });
      if (!appointment) {
        resolve({
          message: Label.NOT_EXISTED_APPOINTMENT,
          success: false,
        });
      }
      let patient = await db.Patient.findOne({
        where: { id: appointmentInfo.patientData.id },
      });
      if (!patient) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      } else {
        let existedEmail = await db.Patient.findOne({
          where: {
            email: appointmentInfo.patientData.email,
            id: {
              [Op.ne]: appointmentInfo.patientData.id,
            },
          },
        });
        if (existedEmail) {
          resolve({
            message: Label.EXISTED_EMAIL,
            success: false,
          });
        } else {
          // update schedule doctor after accept patient info
          const scheduleExist = await db.Schedule.findOne({
            where: {
              doctorId: appointment.dataValues.doctorId,
              date: appointment.dataValues.date,
              timeSlot: appointment.dataValues.timeSlot || "",
            },
          });
          if (appointmentInfo.statusKey == "S1") {
            await scheduleExist.update({
              ...scheduleExist,
              currentNumber: 0,
            });
          } else {
            await scheduleExist.update({
              ...scheduleExist,
              currentNumber: 1,
            });
          }
          await patient.update(appointmentInfo.patientData);
          const newAppointment = await appointment.update(appointmentInfo);
          resolve({
            message: Label.UPDATE_SUCCESS,
            success: true,
            data: newAppointment.dataValues,
          });
        }
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const editStatus = async (appointmentInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let appointment = await db.Appointment.findOne({
        appointment: { id: appointmentInfo.id },
      });
      if (!appointment) {
        resolve({
          message: Label.NOT_EXISTED_APPOINTMENT,
          success: false,
        });
      }
      const newAppointment = await appointment.update({
        status: appointmentInfo.statusKey,
      });
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
        data: newAppointment.dataValues,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteAppointment = async (appointmentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmentInfo = await db.Appointment.findOne({
        where: {
          id: appointmentId,
        },
      });
      const { resultFile } = appointmentInfo;
      await db.Appointment.destroy({
        where: { id: appointmentId },
      });
      if (resultFile) {
        await deleteFile(resultFile);
      }
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
  filterAppointment: filterAppointment,
  editAppointment: editAppointment,
  editStatus: editStatus,
  getAppointmentDetail: getAppointmentDetail,
  deleteAppointment: deleteAppointment,
};
