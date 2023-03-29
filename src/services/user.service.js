// import db from "../models";
import db from "../models/index";
import bcrypt from "bcryptjs";

var salt = bcrypt.genSaltSync(10);

let checkEmail = (emailUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = {};
      // let user = await db.User.findOne({
      //   where: { email: emailUser },
      // });
      if (Object.keys(user).length) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleHashPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashedPassword = await bcrypt.hashSync(password, salt);
      // await db.User.create({
      //   email: data
      // })
      resolve(hashedPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkEmail(data.email);
      if (check) {
        resolve({
          errCode: 1,
          message: "Email da ton tai",
        });
      } else {
        let hashedPassword = await handleHashPassword(data.password);
        let listUser = await db.User.findAll();
        console.log("listUser", listUser);
        await db.User.create({
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender === "1" ? true : false,
          age: data.age,
          roleId: data.roleId,
        });
        resolve({
          errCode: 0,
          message: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExistEmail = await checkEmail(email);
      if (isExistEmail) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errorCode = 0;
            userData.errorMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errorCode = 3;
            userData.errorMessage = "sai mat khau";
          }
        } else {
          userData.errorCode = 2;
          userData.errorMessage = "User khong tim thay";
        }
        resolve();
      } else {
        userData.message = `Email khong ton tai`;
        resolve(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};

// let handleRegister = async (email, password) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let isExistEmail = await checkEmail(email);
//       if (!isExistEmail) {
//         let hashedPassword = hashPassword(password)

//       }
//     } catch (e) {

//     }
//   })
// }

module.exports = {
  handleLogin: handleLogin,
  createNewUser: createNewUser,
};
