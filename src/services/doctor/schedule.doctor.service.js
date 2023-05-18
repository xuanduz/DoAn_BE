import { Op } from "sequelize";
import db from "../../models";
import { Label } from "../../utils/labels/label";

const createSchedule = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { doctorId, date, timeSlots } = data;
      timeSlots.forEach(async (timeSlot, index) => {
        await db.Schedule.create({
          date: date,
          timeSlot: timeSlot,
          currentNumber: 1,
          maxNumber: 1,
          doctorId: doctorId,
        });
      });
      const newSchedule = await db.Schedule.findAll({
        where: {
          date: date,
          doctorId: doctorId,
        },
        raw: true,
      });
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
        data: newSchedule,
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

module.exports = {
  createSchedule: createSchedule,
  getScheduleByDate: getScheduleByDate,
};
