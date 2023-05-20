require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateTokens = (payload) => {
  const { id, email } = payload;

  const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ id, email }, process.env.REFRESH_TOKEN, {
    expiresIn: "5d",
  });

  return { accessToken, refreshToken };
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN);
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

const verifyRefreshToken = (refreshToken) => {
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  generateTokens: generateTokens,
  verifyToken: verifyToken,
  verifyRefreshToken: verifyRefreshToken,
};
