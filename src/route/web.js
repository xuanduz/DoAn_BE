import express from "express";
import authAdminController from "../controller/admin/auth.admin.controller";
import postAdminController from "../controller/admin/post.admin.controller";
import doctorAdminController from "../controller/admin/doctor.admin.controller";
import adminController from "../controller/admin/admin.controller";
import doctorPatientController from "../controller/patient/doctor.patient.controller";
import clinicPatientController from "../controller/patient/clinic.patient.controller";
import specialtyPatientController from "../controller/patient/specialty.patient.controller";
import authPatientController from "../controller/patient/auth.patient.controller";
import appointmentPatientController from "../controller/patient/appointment.patient.controller";
import patientController from "../controller/patient/patient.controller";

import { RouteName } from "./route-name";
import { verifyToken } from "../utils/auth/token";

let router = express.Router();

let initWebRoutes = (app) => {
  // ------------------ Admin -----------------------
  router.post(
    `${RouteName.ADMIN}/register`,
    verifyToken,
    authAdminController.register
  );
  router.post(`${RouteName.ADMIN}/login`, authAdminController.login);
  router.delete(
    `${RouteName.ADMIN}/logout`,
    verifyToken,
    authAdminController.logout
  );
  router.post(
    `${RouteName.ADMIN}/token`,
    authAdminController.getNewAccessToken
  );
  router.post(
    `${RouteName.ADMIN}/admin/edit`,
    verifyToken,
    adminController.editAdmin
  );
  router.post(
    `${RouteName.ADMIN}/admin/change-password`,
    verifyToken,
    adminController.changePasswordAdmin
  );

  router.post(
    `${RouteName.ADMIN}/doctor/post/edit`,
    verifyToken,
    postAdminController.updateDoctorPost
  );
  router.delete(
    `${RouteName.ADMIN}/doctor/post/delete/:id`,
    verifyToken,
    postAdminController.deleteDoctorPost
  );
  router.post(
    `${RouteName.ADMIN}/doctor/add-new`,
    verifyToken,
    doctorAdminController.addNewDoctor
  );
  router.get(
    `${RouteName.ADMIN}/doctor/:id`,
    verifyToken,
    doctorAdminController.getDoctor
  );
  router.post(
    `${RouteName.ADMIN}/doctor/filter`,
    verifyToken,
    doctorAdminController.filterDoctor
  );
  router.post(
    `${RouteName.ADMIN}/doctor/edit`,
    verifyToken,
    doctorAdminController.editDoctor
  );
  router.delete(
    `${RouteName.ADMIN}/doctor/:id`,
    verifyToken,
    doctorAdminController.deleteDoctor
  );
  //! TODO: Thiếu api Clinic

  // ---------------------  Patient  -------------------------
  router.post(`${RouteName.PATIENT}/register`, authPatientController.register);
  router.post(`${RouteName.PATIENT}/login`, authPatientController.login);
  router.delete(
    `${RouteName.PATIENT}/logout`,
    verifyToken,
    authPatientController.logout
  );
  router.post(
    `${RouteName.PATIENT}/token`,
    authPatientController.getNewAccessToken
  );

  router.get(
    `${RouteName.PATIENT}/province/all`,
    patientController.getAllProvince
  );
  router.get(
    `${RouteName.PATIENT}/clinic/all`,
    clinicPatientController.getAllClinic
  );
  router.get(
    `${RouteName.PATIENT}/specialty/all`,
    specialtyPatientController.getAllSpecialty
  );

  router.post(
    `${RouteName.PATIENT}/doctor/filter`,
    doctorPatientController.filterDoctor
  );
  router.get(
    `${RouteName.PATIENT}/doctor/:id`,
    doctorPatientController.getDoctor
  );

  router.post(
    `${RouteName.PATIENT}/clinic/filter`,
    clinicPatientController.filterClinic
  );
  router.get(
    `${RouteName.PATIENT}/clinic/:id`,
    clinicPatientController.getClinic
  );

  router.post(
    `${RouteName.PATIENT}/specialty/filter`,
    specialtyPatientController.filterSpecialty
  );

  router.post(
    `${RouteName.PATIENT}/booking/`,
    verifyToken,
    appointmentPatientController.booking
  );
  router.get(
    `${RouteName.PATIENT}/history/:id`,
    verifyToken,
    appointmentPatientController.getHistoryPatient
  );

  router.put(
    `${RouteName.PATIENT}/edit`,
    verifyToken,
    patientController.editAccount
  );
  router.put(
    `${RouteName.PATIENT}/change-password`,
    verifyToken,
    patientController.changePassword
  );

  //------------------------------------ Doctor --------------------------------

  return app.use("/", router);
};

module.exports = initWebRoutes;
