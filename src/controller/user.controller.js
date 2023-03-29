import userService from "../services/user.service";

const handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      message: "Missing inputs parameter",
    });
  } else {
    let userData = await userService.handleLogin(email, password);
    return res.status(200).json({
      errorCode: userData.errorCode,
      message: userData.errorMessage,
      user: userData.user ? userData.user : {},
    });
  }
};

const handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
  // let email = req.body.email;
  // let password = req.body.password;

  // if (!email || !password) {
  //   return res.status(500).json({
  //     message: "Missing inputs parameter",
  //   });
  // } else {
  //   let userData = await userService.createNewUser(email, password);
  //   return res.status(200).json({
  //     errorCode: userData.errorCode,
  //     message: userData.errorMessage,
  //     user: userData.user ? userData.user : {},
  //   });
  // }
};

module.exports = {
  handleLogin: handleLogin,
  handleCreateNewUser: handleCreateNewUser,
};
