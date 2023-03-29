import db from "../models";
import bcrypt from "bcryptjs";

var salt = bcrypt.genSaltSync(10);

let hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashedPassword = await bcrypt.hashSync(password, salt);
      resolve(hashedPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedPassword = await hashPassword(data.password);
    } catch (e) {
      reject(e);
    }
  });
};

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

let addNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.create({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      resolve("create new user success");
    } catch (e) {
      reject(e);
    }
  });
  // try {
  //   let data = req.body;
  //   console.log(">>> data ", data);
  //   return res.status(200).json({
  //     message: "scucess",
  //   });
  // } catch (err) {
  //   console.log(">>> error ", err);
  //   return res.status(500).json({
  //     message: "error",
  //   });
  // }
};

let editUser = async (req, res) => {
  try {
    let data = req.body;
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

let getUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = db.User.findOne({ where: { id: userId } });
      if (user) {
        resolve(user);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getHomePage: getHomePage,
  getAllUser: getAllUser,
  addNewUser: addNewUser,
  editUser: editUser,
  getUserById: getUserById,
  createNewUser: createNewUser,
};
