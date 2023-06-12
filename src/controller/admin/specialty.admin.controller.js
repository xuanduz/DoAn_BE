import specialtyAdminService from "../../services/admin/specialty.admin.service";

const addNewSpecialty = async (req, res) => {
  try {
    const result = await specialtyAdminService.addNewSpecialty(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getSpecialty = async (req, res) => {
  try {
    const result = await specialtyAdminService.getSpecialty(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const filterSpecialty = async (req, res) => {
  try {
    const result = await specialtyAdminService.filterSpecialty(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const editSpecialty = async (req, res) => {
  try {
    const result = await specialtyAdminService.editSpecialty(req.body, req.file);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const result = await specialtyAdminService.deleteSpecialty(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  addNewSpecialty: addNewSpecialty,
  getSpecialty: getSpecialty,
  filterSpecialty: filterSpecialty,
  editSpecialty: editSpecialty,
  deleteSpecialty: deleteSpecialty,
};
