import scheduleDoctorService from "../../services/doctor/schedule.doctor.service";

const createSchedule = async (req, res) => {
  try {
    const result = await scheduleDoctorService.createSchedule(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getScheduleByDate = async (req, res) => {
  try {
    const result = await scheduleDoctorService.getScheduleByDate(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getAllScheduleCode = async (req, res) => {
  try {
    const result = await scheduleDoctorService.getAllScheduleCode();
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  createSchedule: createSchedule,
  getScheduleByDate: getScheduleByDate,
  getAllScheduleCode: getAllScheduleCode,
};
