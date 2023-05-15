import patientService from "../../services/patient/patient.service";

const editAccount = async (req, res) => {
  try {
    const result = await patientService.editAccount(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await patientService.changePassword(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getAllProvince = async (req, res) => {
  try {
    const result = await patientService.getAllProvince();
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  editAccount: editAccount,
  changePassword: changePassword,
  getAllProvince: getAllProvince,
};
