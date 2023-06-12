import clinicAdminService from "../../services/admin/clinic.admin.service";

const addNewClinic = async (req, res) => {
  try {
    const result = await clinicAdminService.addNewClinic(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getClinic = async (req, res) => {
  try {
    const result = await clinicAdminService.getClinic(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const filterClinic = async (req, res) => {
  try {
    const result = await clinicAdminService.filterClinic(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editClinic = async (req, res) => {
  try {
    const result = await clinicAdminService.editClinic(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const deleteClinic = async (req, res) => {
  try {
    const result = await clinicAdminService.deleteClinic(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  addNewClinic: addNewClinic,
  getClinic: getClinic,
  filterClinic: filterClinic,
  editClinic: editClinic,
  deleteClinic: deleteClinic,
};
