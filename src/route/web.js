import express from "express";
import homeController from "../controller/home.controller";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  router.get("/api/user", homeController.getAllUser);
  // router.post("/api/user", homeController.addNewUser);
  // router.put("/api/user", homeController.editUser);
  return app.use("/", router);
};

module.exports = initWebRoutes;
