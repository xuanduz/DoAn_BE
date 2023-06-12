import express from "express";
import adminController from "../controller/admin/admin.controller";
import authAdminController from "../controller/admin/auth.admin.controller";
import doctorAdminController from "../controller/admin/doctor.admin.controller";
import clinicAdminController from "../controller/admin/clinic.admin.controller";
import specialtyAdminController from "../controller/admin/specialty.admin.controller";
import appointmentAdminController from "../controller/admin/appointment.admin.controller";

import patientController from "../controller/patient/patient.controller";
import doctorPatientController from "../controller/patient/doctor.patient.controller";
import clinicPatientController from "../controller/patient/clinic.patient.controller";
import specialtyPatientController from "../controller/patient/specialty.patient.controller";
import authPatientController from "../controller/patient/auth.patient.controller";
import appointmentPatientController from "../controller/patient/appointment.patient.controller";

import authDoctorController from "../controller/doctor/auth.doctor.controller";
import doctorController from "../controller/doctor/doctor.controller";
import scheduleDoctorController from "../controller/doctor/schedule.doctor.controller";
import appointmentDoctorController from "../controller/doctor/appointment.doctor.controller";
import appointmentDoctorService from "../services/doctor/appointment.doctor.service";

import { RouteName } from "./route-name";
import { verifyToken } from "../utils/auth/token";

import multer from "multer";

let router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 *
 * @swagger
 * /api/system-admin/register:
 *   post:
 *    summary: Get a user by ID
 * responses:
 *      '200':
 *       description: A single user.
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *        properties:
 *         id:
 *          type: integer
 *       name:
 *        type: string
 */
let initWebRoutes = (app) => {
  // ------------------ Admin -----------------------

  router.post(`${RouteName.ADMIN}/register`, verifyToken, authAdminController.register);

  router.post(`${RouteName.ADMIN}/login`, authAdminController.login);
  router.delete(`${RouteName.ADMIN}/logout`, verifyToken, authAdminController.logout);
  router.post(`${RouteName.ADMIN}/token`, authAdminController.getNewAccessToken);
  router.post(`${RouteName.ADMIN}/admin/edit`, verifyToken, adminController.editAdmin);
  router.post(
    `${RouteName.ADMIN}/change-password`,
    verifyToken,
    adminController.changePasswordAdmin
  );

  router.post(
    `${RouteName.ADMIN}/doctor/add-new`,
    verifyToken,
    upload.single("filename"),
    doctorAdminController.addNewDoctor
  );
  router.get(`${RouteName.ADMIN}/doctor/:id`, verifyToken, doctorAdminController.getDoctor);
  router.post(`${RouteName.ADMIN}/doctor/filter`, verifyToken, doctorAdminController.filterDoctor);
  router.post(
    `${RouteName.ADMIN}/doctor/edit`,
    verifyToken,
    upload.single("filename"),
    doctorAdminController.editDoctor
  );
  router.delete(`${RouteName.ADMIN}/doctor/:id`, verifyToken, doctorAdminController.deleteDoctor);
  router.get(
    `${RouteName.ADMIN}/doctor/get-by-clinic/:id`,
    verifyToken,
    doctorAdminController.getDoctorByClinic
  );

  router.post(
    `${RouteName.ADMIN}/specialty/filter`,
    verifyToken,
    specialtyAdminController.filterSpecialty
  );
  router.post(
    `${RouteName.ADMIN}/specialty/edit`,
    verifyToken,
    upload.single("filename"),
    specialtyAdminController.editSpecialty
  );
  router.post(
    `${RouteName.ADMIN}/specialty/add-new`,
    verifyToken,
    upload.single("filename"),
    specialtyAdminController.addNewSpecialty
  );
  router.delete(
    `${RouteName.ADMIN}/specialty/:id`,
    verifyToken,
    specialtyAdminController.deleteSpecialty
  );

  router.post(
    `${RouteName.ADMIN}/clinic/add-new`,
    verifyToken,
    upload.single("filename"),
    clinicAdminController.addNewClinic
  );
  // router.post(`${RouteName.ADMIN}/clinic/add-new`, verifyToken, , clinicAdminController.addNewClinic);
  router.get(`${RouteName.ADMIN}/clinic/:id`, verifyToken, clinicAdminController.getClinic);
  router.post(`${RouteName.ADMIN}/clinic/filter`, verifyToken, clinicAdminController.filterClinic);
  router.post(
    `${RouteName.ADMIN}/clinic/edit`,
    verifyToken,
    upload.single("filename"),
    clinicAdminController.editClinic
  );
  router.delete(`${RouteName.ADMIN}/clinic/:id`, verifyToken, clinicAdminController.deleteClinic);

  router.post(
    `${RouteName.ADMIN}/appointment/filter`,
    verifyToken,
    appointmentAdminController.filterAppointment
  );
  router.post(
    `${RouteName.ADMIN}/appointment/edit`,
    verifyToken,
    appointmentAdminController.editAppointment
  );
  router.post(
    `${RouteName.ADMIN}/appointment/status/edit`,
    verifyToken,
    appointmentAdminController.editStatus
  );
  router.get(
    `${RouteName.ADMIN}/appointment/:id`,
    verifyToken,
    appointmentAdminController.getAppointmentDetail
  );

  router.delete(
    `${RouteName.ADMIN}/appointment/:id`,
    verifyToken,
    appointmentAdminController.deleteAppointment
  );

  // ---------------------  Patient  -------------------------
  router.post(`${RouteName.PATIENT}/register`, authPatientController.register);
  router.post(`${RouteName.PATIENT}/login`, authPatientController.login);
  router.delete(`${RouteName.PATIENT}/logout`, verifyToken, authPatientController.logout);
  router.post(`${RouteName.PATIENT}/token`, authPatientController.getNewAccessToken);
  router.post(`${RouteName.PATIENT}/forgot-password`, authPatientController.forgotPassword);
  router.post(`${RouteName.PATIENT}/verify-code`, authPatientController.verifyCode);
  router.post(`${RouteName.PATIENT}/new-password`, authPatientController.setNewPassword);

  router.get(`${RouteName.PATIENT}/province/all`, patientController.getAllProvince);
  router.get(`${RouteName.PATIENT}/position/all`, patientController.getAllPosition);
  router.get(`${RouteName.PATIENT}/clinic/all`, clinicPatientController.getAllClinic);
  router.get(`${RouteName.PATIENT}/specialty/all`, specialtyPatientController.getAllSpecialty);
  router.get(`${RouteName.PATIENT}/specialty/:id`, specialtyPatientController.getSpecialty);
  router.get(`${RouteName.PATIENT}/patient/:id`, verifyToken, patientController.getPatient);
  router.put(`${RouteName.PATIENT}/patient/edit`, verifyToken, patientController.editAccount);
  router.put(
    `${RouteName.PATIENT}/patient/change-password`,
    verifyToken,
    patientController.changePassword
  );

  router.post(
    `${RouteName.PATIENT}/doctor/featured/filter`,
    doctorPatientController.filterFeaturedDoctor
  );
  router.post(`${RouteName.PATIENT}/doctor/filter`, doctorPatientController.filterDoctor);
  router.get(`${RouteName.PATIENT}/doctor/:id`, doctorPatientController.getDoctor);
  router.get(`${RouteName.PATIENT}/doctor/relate/:id`, doctorPatientController.getRelateDoctor);
  router.post(`${RouteName.PATIENT}/clinic/filter`, clinicPatientController.filterClinic);
  router.get(`${RouteName.PATIENT}/clinic/:id`, clinicPatientController.getClinic);
  router.get(
    `${RouteName.PATIENT}/clinic/getByProvince/:provinceKey`,
    clinicPatientController.getClinicByProvince
  );

  router.post(`${RouteName.PATIENT}/specialty/filter`, specialtyPatientController.filterSpecialty);

  router.post(`${RouteName.PATIENT}/booking`, verifyToken, appointmentPatientController.booking);

  router.post(`${RouteName.PATIENT}/verify-email`, appointmentPatientController.verifyEmail);

  router.post(
    `${RouteName.PATIENT}/booking-direct`,
    verifyToken,
    appointmentPatientController.bookingDirect
  );

  router.delete(
    `${RouteName.PATIENT}/booking/delete/:id`,
    verifyToken,
    appointmentPatientController.deleteBooking
  );

  router.get(
    `${RouteName.PATIENT}/history/:id`,
    verifyToken,
    appointmentPatientController.getHistoryPatient
  );

  //------------------------------------ Doctor --------------------------------
  router.post(`${RouteName.DOCTOR}/register`, authDoctorController.register);
  router.post(`${RouteName.DOCTOR}/login`, authDoctorController.login);
  router.post(`${RouteName.DOCTOR}/token`, authDoctorController.getNewAccessToken);
  router.delete(`${RouteName.DOCTOR}/logout`, verifyToken, authDoctorController.logout);
  router.post(
    `${RouteName.DOCTOR}/change-password`,
    verifyToken,
    doctorController.changePasswordDoctor
  );
  router.get(`${RouteName.DOCTOR}/doctor/:id`, verifyToken, doctorController.getDetail);
  router.put(
    `${RouteName.DOCTOR}/doctor/edit`,
    verifyToken,
    upload.single("filename"),
    doctorController.editDoctor
  );
  router.post(
    `${RouteName.DOCTOR}/schedule/by-date`,
    verifyToken,
    scheduleDoctorController.getScheduleByDate
  );
  router.get(`${RouteName.DOCTOR}/schedule/all`, scheduleDoctorController.getAllScheduleCode);
  router.post(
    `${RouteName.DOCTOR}/schedule/create`,
    verifyToken,
    scheduleDoctorController.createSchedule
  );

  router.post(
    `${RouteName.DOCTOR}/appointment/filter`,
    verifyToken,
    appointmentDoctorController.filterAppointment
  );
  router.post(
    `${RouteName.DOCTOR}/appointment/edit`,
    verifyToken,
    upload.single("filename"),
    appointmentDoctorController.editAppointment
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
