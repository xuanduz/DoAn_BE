import db from "../models";

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

module.exports = {
  getHomePage: getHomePage,
};
