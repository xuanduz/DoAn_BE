import specialtyPatientService from "../../services/patient/specialty.patient.service";

const filterSpecialty = async (req, res) => {
  try {
    const result = await specialtyPatientService.filterSpecialty(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getAllSpecialty = async (req, res) => {
  try {
    const result = await specialtyPatientService.getAllSpecialty();
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getSpecialty = async (req, res) => {
  try {
    const result = await specialtyPatientService.getSpecialty(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  filterSpecialty: filterSpecialty,
  getAllSpecialty: getAllSpecialty,
  getSpecialty: getSpecialty,
};
