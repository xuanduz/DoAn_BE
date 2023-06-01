import appointmentAdminService from "../../services/admin/appointment.admin.service";

const filterAppointment = async (req, res) => {
  try {
    const result = await appointmentAdminService.filterAppointment(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editAppointment = async (req, res) => {
  try {
    const result = await appointmentAdminService.editAppointment(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editStatus = async (req, res) => {
  try {
    const result = await appointmentAdminService.editStatus(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getAppointmentDetail = async (req, res) => {
  try {
    const result = await appointmentAdminService.getAppointmentDetail(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const result = await appointmentAdminService.deleteAppointment(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  editStatus: editStatus,
  filterAppointment: filterAppointment,
  editAppointment: editAppointment,
  deleteAppointment: deleteAppointment,
  getAppointmentDetail: getAppointmentDetail,
};
