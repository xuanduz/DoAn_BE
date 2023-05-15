import clinicPatientService from "../../services/patient/clinic.patient.service";

const filterClinic = async (req, res) => {
  try {
    const result = await clinicPatientService.filterClinic(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getClinic = async (req, res) => {
  try {
    const result = await clinicPatientService.getClinic(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getAllClinic = async (req, res) => {
  try {
    const result = await clinicPatientService.getAllClinic();
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  filterClinic: filterClinic,
  getClinic: getClinic,
  getAllClinic: getAllClinic,
};
