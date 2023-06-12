import doctorService from "../../services/doctor/doctor.service";

const editDoctor = async (req, res) => {
  try {
    const result = await doctorService.editDoctor(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getDetail = async (req, res) => {
  try {
    const result = await doctorService.getDetail(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const changePasswordDoctor = async (req, res) => {
  try {
    const result = await doctorService.changePasswordDoctor(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  editDoctor: editDoctor,
  changePasswordDoctor: changePasswordDoctor,
  getDetail: getDetail,
};
