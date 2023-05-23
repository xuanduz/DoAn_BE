import { Op } from "sequelize";
import db from "../../models";
import { Label } from "../../utils/labels/label";
import multer from "multer";
import path from "path";

// storage abnd upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/Files/appointment");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const whitelist = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (whitelist.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("resultFile");

const editAppointment = async (appointmentInfo, file) => {
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
      const appointmentUpdate = {
        doctorId: appointmentInfo.doctorId,
        patientId: appointmentInfo.patientId,
        statusKey: appointmentInfo.statusKey,
        date: appointmentInfo.date,
        time: appointmentInfo.time,
        timeSlot: appointmentInfo.timeSlot,
        reason: appointmentInfo.reason,
        bookingType: appointmentInfo.bookingType,

        resultFile: file ? file.path : appointment.dataValues.resultFile,
      };
      const newAppointment = await appointment.update(appointmentUpdate);
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

const filterAppointment = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, orderBy, doctorId, date, statusKey, patientName, bookingType } =
        filter;
      const listSchedule = await db.Appointment.findAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        distinct: true,
        order: [["createdAt", orderBy || "DESC"]],
        where: {
          doctorId: doctorId,
          date: {
            [Op.like]: `%${date ? date : ""}%`,
          },
          bookingType: bookingType ? bookingType : "B1",
          statusKey: {
            [Op.like]: `%${statusKey ? statusKey : ""}%`,
            [Op.ne]: "S1",
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
          {
            model: db.Code,
            as: "statusData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listSchedule,
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
  uploadFile: uploadFile,
};
