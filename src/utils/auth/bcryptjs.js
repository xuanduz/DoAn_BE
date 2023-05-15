var salt = bcrypt.genSaltSync(10);
import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashedPassword = await bcrypt.hashSync(password, salt);
      resolve(hashedPassword);
    } catch (e) {
      reject(e);
    }
  });
};

const comparePassword = (loginPassword, accountPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      var compared = await bcrypt.compareSync(loginPassword, accountPassword);
      resolve(compared);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  hashPassword: hashPassword,
  comparePassword: comparePassword,
};
