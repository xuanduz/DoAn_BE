import db from "../../models";
import { Label } from "../../utils/labels/label";
const { Op } = require("sequelize");
import moment from "moment";

const booking = async (bookingData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        patientId,
        doctorId,
        date,
        time,
        timeSlot,
        reason,
        statusKey,
        bookingType,
      } = bookingData;
      let dateNow = new Date();
      let currentDate = moment().format("DD-MM-YYYY");
      let currentHour = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
      let timeNow = moment(
        `${currentDate} ${currentHour}`,
        "DD-MM-YYYY hh:mm"
      ).toDate();

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
          date: date,
          time: time,
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
