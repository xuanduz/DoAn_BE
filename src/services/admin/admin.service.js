import db from "../../models";
import { Label } from "../../utils/labels/label";
import Bcryptjs from "../../utils/auth/bcryptjs";

const editAdmin = async (adminInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let admin = await db.Admin.findOne({
        where: { id: adminInfo.id },
      });
      if (!admin) {
        resolve({
          message: Label.NOT_EXISTED_ACCOUNT,
          success: false,
        });
      }
      let existEmail = await db.Admin.findOne({
        where: {
          email: adminInfo.email,
          id: { [Op.ne]: adminInfo.id },
        },
      });
      if (existEmail) {
        resolve({
          message: Label.EXISTED_EMAIL,
          success: false,
        });
      } else {
        const newAdmin = await admin.update(adminInfo);
        resolve({
          message: Label.UPDATE_SUCCESS,
          success: true,
          data: newAdmin.dataValues,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const changePasswordAdmin = async (adminInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.Admin.findOne({
        where: { email: adminInfo.email },
        raw: true,
      });
      let comparePassword = await Bcryptjs.comparePassword(adminInfo.oldPassword, account.password);
      if (!comparePassword) {
        resolve({
          message: Label.WRONG_OLD_PASSWORD,
          success: false,
        });
      } else {
        let hashedNewPassword = await Bcryptjs.hashPassword(adminInfo.newPassword);
        await db.Admin.update(
          {
            password: hashedNewPassword,
          },
          {
            where: { email: adminInfo.email },
          }
        );
        resolve({
          message: Label.CHANGE_PASSWORD_SUCCESS,
          success: true,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  editAdmin: editAdmin,
  changePasswordAdmin: changePasswordAdmin,
};
