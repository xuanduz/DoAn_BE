import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");

const booking = async (bookingData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        patientId,
        doctorId,
        date,
        timeSlot,
        reason,
        statusKey,
        bookingType,
      } = bookingData;
      const timeType = await db.Code.findOne({
        where: {
          type: "TIME",
          value: timeSlot,
        },
        raw: true,
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
          date: date || new Date().toISOString().slice(0, 19).replace("T", " "),
          patientId: patientId,
          doctorId: doctorId,
          timeSlot: timeType.key,
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

const getHistoryPatient = async (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointments = await db.Appointment.findAll({
        where: {
          patientId: patientId,
        },
        raw: true,
      });
      resolve({
        message: Label.NOT_EXIST_APPOINTMENT,
        success: false,
        data: appointments,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  booking: booking,
  getHistoryPatient: getHistoryPatient,
};
