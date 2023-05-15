import postAdminService from "../../services/admin/post.admin.service";

const updateDoctorPost = async (req, res) => {
  try {
    const result = await postAdminService.addNewPost(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const deleteDoctorPost = async (req, res) => {
  try {
    const result = await postAdminService.deleteDoctorPost(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  updateDoctorPost: updateDoctorPost,
  deleteDoctorPost: deleteDoctorPost,
};
