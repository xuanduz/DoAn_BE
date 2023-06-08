import appointmentDoctorService from "../../services/doctor/appointment.doctor.service";

const filterAppointment = async (req, res) => {
  try {
    const result = await appointmentDoctorService.filterAppointment(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editAppointment = async (req, res) => {
  try {
    const result = await appointmentDoctorService.editAppointment(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

// const uploadFile = async (req, res) => {
//   try {
//     const result = await appointmentDoctorService.uploadFile(req);
//     return res.status(200).json(result);
//   } catch (err) {
//     console.log("err", err);
//     return res.sendStatus(403);
//   }
// };

module.exports = {
  filterAppointment: filterAppointment,
  editAppointment: editAppointment,
  // uploadFile: uploadFile,
};
