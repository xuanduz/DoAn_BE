import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");
import moment from "moment";

const booking = async (bookingData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { patientData, doctorId, date, time, timeSlot, reason, statusKey, bookingType } =
        bookingData;
      await db.Patient.update(patientData, {
        where: {
          id: patientData.id,
        },
      });
      const existDoctor = await db.Doctor.findOne({
        where: {
          id: doctorId,
        },
        raw: true,
      });
      if (!existDoctor) {
        resolve({
          message: Label.BOOKING_FAIL_NOT_EXIST_DOCTOR,
          success: false,
        });
      } else {
        await db.Appointment.create({
          statusKey: statusKey || "S1",
          date: date,
          time: time,
          patientId: patientData.id,
          doctorId: doctorId,
          timeSlot: timeSlot,
          reason: reason,
          bookingType: bookingType || "B1",
        });
        resolve({
          message: Label.BOOKING_SUCCESS,
          success: true,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const bookingDirect = async (bookingData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { clinicId, provinceKey, patientData, date, time, timeSlot, reason } = bookingData;
      await db.Patient.update(patientData, {
        where: {
          id: patientData.id,
        },
      });
      await db.Appointment.create({
        statusKey: "S1",
        date: date,
        time: time,
        patientId: patientData.id,
        clinicId: clinicId,
        timeSlot: timeSlot,
        reason: reason,
        bookingType: "B1",
      });
      resolve({
        message: Label.BOOKING_SUCCESS,
        success: true,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getHistoryPatient = async (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointments = await db.Appointment.findAll({
        where: {
          patientId: patientId,
        },
        include: [
          {
            model: db.Doctor,
            as: "doctorData",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "password",
                "refreshToken",
                "accessToken",
                "descriptionHTML",
              ],
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
                model: db.Clinic,
                as: "clinicData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "descriptionHTML", "email"],
                },
              },
            ],
          },
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "descriptionHTML", "email"],
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
            as: "timeData",
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
        ],
        nest: true,
      });
      if (!appointments.length) {
        resolve({
          message: Label.NOT_EXIST_APPOINTMENT,
          success: false,
          data: appointments,
        });
      } else {
        resolve({
          message: Label.SUCCESS,
          success: true,
          data: appointments,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  booking: booking,
  bookingDirect: bookingDirect,
  getHistoryPatient: getHistoryPatient,
};
