import express from "express";
import homeController from "../controller/home.controller";
import userController from "../controller/user.controller";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/api/user", homeController.getAllUser);
  // router.post("/api/user", homeController.addNewUser);
  // router.put("/api/user", homeController.editUser);

  router.post("/api/user/login", userController.handleLogin);
  router.post("/api/user/register", userController.handleCreateNewUser);
  return app.use("/", router);
};

module.exports = initWebRoutes;
