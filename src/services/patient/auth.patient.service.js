import db from "../../models";
import Bcryptjs from "../../utils/auth/bcryptjs";
import { generateTokens, verifyRefreshToken } from "../../utils/auth/token";
import { Label } from "../../utils/labels/label";
import { getCodePassword } from "../../utils/pagingData";
import { sendEmailToNewPass } from "./email.patient.service";

const resetToken = async (email) => {
  await db.Patient.update(
    {
      refreshToken: null,
      accessToken: null,
    },
    { where: { email: email } }
  );
};

const createNewAccount = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let accountExisted = await db.Patient.findOne({
        where: { email: data.email },
      });
      let response = {};
      if (!accountExisted) {
        let hashedPassword = await Bcryptjs.hashPassword(data.password);
        await db.Patient.create({
          email: data.email,
          password: hashedPassword,
          fullName: data.fullName,
          addressDetail: data.addressDetail,
          provinceKey: data.provinceKey,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          birthday: data.birthday,
        });
        response = { message: Label.CREATE_ACCOUNT_SUCCESS, success: true };
      } else {
        response = { message: Label.EXISTED_EMAIL, success: false };
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};

const login = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let account = await db.Patient.findOne({
        where: { email: data.email },
        nest: true,
      });
      let result = {};
      if (account) {
        let comparePassword = await Bcryptjs.comparePassword(data.password, account.password);
        if (comparePassword) {
          let token = generateTokens(account);
          await db.Patient.update(
            {
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
            },
            { where: { email: data.email } }
          );
          result = {
            message: Label.LOGIN_SUCCESS,
            success: true,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
          };
        } else {
          result = {
            message: Label.WRONG_PASSWORD_OR_EMAIL,
            success: false,
          };
        }
      } else {
        result = {
          message: Label.WRONG_PASSWORD_OR_EMAIL,
          success: false,
        };
      }
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

const forgotPassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = getCodePassword(6);
      await db.Patient.update(
        {
          codePassword: code,
        },
        {
          where: {
            email: data.email,
          },
        }
      );
      await sendEmailToNewPass({
        email: data.email,
        code: code,
      });
      resolve({
        message: Label.CHECK_EMAIL,
        success: true,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const verifyCode = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const patient = await db.Patient.findOne({
        where: {
          email: data.email,
        },
      });
      if (patient.dataValues.codePassword != data.codePassword) {
        resolve({
          message: Label.WRONG_CODE,
          success: false,
        });
      } else {
        resolve({
          message: Label.SUCCESS_CODE,
          success: true,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const setNewPassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedNewPassword = await Bcryptjs.hashPassword(data.newPassword);
      await db.Patient.update(
        {
          password: hashedNewPassword,
          codePassword: "",
          refreshToken: null,
          accessToken: null,
        },
        {
          where: {
            email: data.email,
            codePassword: data.codePassword,
          },
        }
      );
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const logout = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await db.Patient.findOne({
        where: { email: data.email },
      });
      await resetToken(account.email);
      resolve({
        success: true,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateRefreshToken = async (email, refreshToken) => {
  await db.Patient.update(
    {
      refreshToken: refreshToken,
    },
    { where: { email: email } }
  );
};

const getNewAccessToken = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refreshToken = req.body.refreshToken;
      const account = await db.Patient.findOne({
        where: { refreshToken: refreshToken },
        nest: true,
      });
      if (!account) {
        resolve(res.sendStatus(403));
      }
      if (verifyRefreshToken(refreshToken)) {
        const tokens = generateTokens(account);
        updateRefreshToken(account.email, refreshToken);
        resolve(res.status(200).json(tokens));
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewAccount: createNewAccount,
  login: login,
  logout: logout,
  getNewAccessToken: getNewAccessToken,
  forgotPassword: forgotPassword,
  verifyCode: verifyCode,
  setNewPassword: setNewPassword,
};
