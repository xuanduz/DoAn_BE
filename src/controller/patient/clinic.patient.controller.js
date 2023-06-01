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

const filterFeaturedClinic = async (req, res) => {
  try {
    const result = await clinicPatientService.filterFeaturedClinic(req.body);
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

const getClinicByProvince = async (req, res) => {
  try {
    const result = await clinicPatientService.getClinicByProvince(req.params.provinceKey);
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
  getClinicByProvince: getClinicByProvince,
  getAllClinic: getAllClinic,
  filterFeaturedClinic: filterFeaturedClinic,
};
