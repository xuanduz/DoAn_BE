import doctorAdminService from "../../services/admin/doctor.admin.service";

const addNewDoctor = async (req, res) => {
  try {
    const result = await doctorAdminService.addNewDoctor(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getDoctor = async (req, res) => {
  try {
    const result = await doctorAdminService.getDoctor(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getDoctorByClinic = async (req, res) => {
  try {
    const result = await doctorAdminService.getDoctorByClinic(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const filterDoctor = async (req, res) => {
  try {
    const result = await doctorAdminService.filterDoctor(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editDoctor = async (req, res) => {
  try {
    const result = await doctorAdminService.editDoctor(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const result = await doctorAdminService.deleteDoctor(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  addNewDoctor: addNewDoctor,
  getDoctor: getDoctor,
  filterDoctor: filterDoctor,
  editDoctor: editDoctor,
  deleteDoctor: deleteDoctor,
  getDoctorByClinic: getDoctorByClinic,
};
