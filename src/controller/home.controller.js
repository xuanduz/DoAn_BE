import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (err) {
    console.log("error ", err);
  }
};

let getAllUser = async (req, res) => {
  try {
    console.log(">>> get all");
    let data = await db.User.findAll();
    return res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "error",
    });
  }
};

let addNewUser = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(">>> message", message);
  return res.status(200).json({
    message: "success",
  });
};

let editUser = async (req, res) => {
  try {
    let userId = req.query.id;
    console.log("userId", userId, req.query);
    if (userId) {
      let userData = await CRUDService.getUserById(userId);
      console.log(">>> ", userData);
      return res.send("found");
    }
    console.log(">>> data ", data);
    return res.status(200).json({
      message: "scucess",
    });
  } catch (err) {
    console.log(">>> error ", err);
    return res.status(500).json({
      message: "error",
    });
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAllUser: getAllUser,
  addNewUser: addNewUser,
  editUser: editUser,
};
