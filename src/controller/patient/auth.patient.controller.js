import authPatientService from "../../services/patient/auth.patient.service";

let register = async (req, res) => {
  try {
    let result = await authPatientService.createNewAccount(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err ", err);
    return res.sendStatus(403);
  }
};

let login = async (req, res) => {
  try {
    let result = await authPatientService.login(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err ", err);
    return res.sendStatus(403);
  }
};

let logout = async (req, res) => {
  try {
    await authPatientService.logout(req.body);
    return res.sendStatus(204);
  } catch (err) {
    console.log("err ", err);
    return res.sendStatus(404);
  }
};

const getNewAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    await authPatientService.getNewAccessToken(req, res);
  } catch (err) {
    console.log("err ", err);
    res.sendStatus(403);
  }
};

module.exports = {
  register: register,
  login: login,
  logout: logout,
  getNewAccessToken: getNewAccessToken,
};
