import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

viewEngine(app);
initWebRoutes(app);

connectDB();

// const options = {
//   definition: {
//     openapi: "3.1.0",
//     info: {
//       title: "LogRocket Express API with Swagger",
//       version: "0.1.0",
//       description:
//         "This is a simple CRUD API application made with Express and documented with Swagger",
//       license: {
//         name: "MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "LogRocket",
//         url: "https://logrocket.com",
//         email: "info@email.com",
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:6969",
//         description: 'Development server',
//       },
//     ],
//   },
//   apis: ["./route/*.js"],
// };

// const specs = swaggerJsdoc(options);

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(specs, { explorer: true })
// );

let port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log("backend is running on the port ", port);
});
