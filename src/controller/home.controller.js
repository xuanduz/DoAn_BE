let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
  // return res.send("hello controller");
};

module.exports = {
  getHomePage: getHomePage,
};
