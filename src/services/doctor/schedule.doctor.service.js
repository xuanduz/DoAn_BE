import { Op } from "sequelize";
import db from "../../models";
import { Label } from "../../utils/labels/label";

const createSchedule = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { doctorId, date, timeSlots } = data;
      await db.Schedule.destroy({
        where: {
          doctorId: doctorId,
          date: date,
        },
      });
      const listScheduleCreate = timeSlots.map((time) => ({
        date: date,
        timeSlot: time,
        currentNumber: 0,
        maxNumber: 1,
        doctorId: doctorId,
      }));
      const listScheduleUpdated = await db.Schedule.bulkCreate(listScheduleCreate);
      Promise.all(listScheduleUpdated).then((data) => {
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: data,
        });
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getScheduleByDate = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { doctorId, date } = data;
      const listSchedule = await db.Schedule.findAll({
        where: {
          doctorId: doctorId,
          date: date,
        },
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

const getAllScheduleCode = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const listSchedule = await db.Code.findAll({
        where: {
          type: "TIME",
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
  createSchedule: createSchedule,
  getScheduleByDate: getScheduleByDate,
  getAllScheduleCode: getAllScheduleCode,
};
