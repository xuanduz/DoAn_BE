import db from "../../models";
import { deleteFile } from "../../utils/firebase-function";
import { Label } from "../../utils/labels/label";
import emailService from "./email.patient.service";

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
        // check duplicate appointment
        const existAppointment = await db.Appointment.findOne({
          where: {
            patientId: patientData.id,
            date: date,
            timeSlot: timeSlot,
          },
        });
        if (existAppointment) {
          resolve({
            message: Label.BOOKING_DUPLICATE,
            success: false,
          });
        } else {
          const timeData = await db.Code.findOne({
            where: {
              key: timeSlot,
            },
          });
          let dataSend = {
            receiverEmail: patientData.email,
            fullName: patientData.fullName,
            time: timeData.value,
            doctorName: existDoctor.fullName,
            //---------
            timeSlot: timeSlot,
            date: date,
            doctorId: doctorId,
            patientId: patientData.id,
          };
          await emailService.sendEmailToVerify(dataSend);
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
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const verifyEmail = async (appointmentInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check appointment deleted before verify
      // update schedule doctor after accept patient info
      // 1. update curentNumber
      // 2. update statusKey
      const scheduleExist = await db.Schedule.findOne({
        where: {
          doctorId: appointmentInfo.doctorId,
          date: appointmentInfo.date,
          timeSlot: appointmentInfo.timeSlot || "",
        },
      });
      if (scheduleExist.dataValues.currentNumber == 1) {
        resolve({
          message: Label.VERIFIED_EMAIL,
          success: false,
        });
      } else {
        await db.Appointment.update(
          {
            statusKey: "S2",
          },
          {
            where: {
              patientId: appointmentInfo.patientId,
              doctorId: appointmentInfo.doctorId,
              date: appointmentInfo.date,
              timeSlot: appointmentInfo.timeSlot,
            },
          }
        );
        await scheduleExist.update({
          ...scheduleExist,
          currentNumber: 1,
        });
        resolve({
          message: Label.VERIFY_EMAIL_SUCCESS,
          success: true,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteBooking = async (bookingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appointmentInfo = await db.Appointment.findOne({
        where: {
          id: bookingId,
        },
      });
      const { doctorId, timeSlot, date, statusKey, resultFile } = appointmentInfo;
      await db.Appointment.destroy({
        where: { id: bookingId },
      });
      if (statusKey == "S1" || statusKey == "S2") {
        const schedule = await db.Schedule.findOne({
          where: {
            doctorId: doctorId,
            date: date,
            timeSlot: timeSlot,
          },
        });
        await schedule.update({
          currentNumber: 0,
        });
      } else {
        if (resultFile) {
          await deleteFile(resultFile);
        }
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
  deleteBooking: deleteBooking,
  verifyEmail: verifyEmail,
};
