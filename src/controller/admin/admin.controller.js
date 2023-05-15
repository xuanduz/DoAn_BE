import adminService from "../../services/admin/admin.service";

const editAdmin = async (req, res) => {
  try {
    const result = await adminService.editAdmin(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const changePasswordAdmin = async (req, res) => {
  try {
    const result = await adminService.changePasswordAdmin(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  editAdmin: editAdmin,
  changePasswordAdmin: changePasswordAdmin,
};
