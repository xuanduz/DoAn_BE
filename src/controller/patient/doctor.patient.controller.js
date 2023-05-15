import doctorPatientService from "../../services/patient/doctor.patient.service";

const filterDoctor = async (req, res) => {
  try {
    const result = await doctorPatientService.filterDoctor(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getDoctor = async (req, res) => {
  try {
    const result = await doctorPatientService.getDoctor(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  filterDoctor: filterDoctor,
  getDoctor: getDoctor,
};
