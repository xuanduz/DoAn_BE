const jwt = required("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    req.id = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
};

module.exports = verifyToken;
