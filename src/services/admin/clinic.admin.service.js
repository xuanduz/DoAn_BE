import db from "../../models";
import { deleteFile, uploadImage } from "../../utils/firebase-function";
import { Label } from "../../utils/labels/label";
import { getListData, getPageAmount } from "../../utils/pagingData";
const { Op } = require("sequelize");

const addNewClinic = async (clinicData, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkExisted = await db.Clinic.findOne({
        where: { email: clinicData.email },
        raw: true,
      });
      if (checkExisted) {
        resolve({
          message: Label.EXISTED_EMAIL,
          success: false,
        });
      } else {
        const imageUrl = file ? await uploadImage(file) : "";
        const newClinic = await db.Clinic.create({
          email: clinicData.email,
          name: clinicData.name,
          address: clinicData.address,
          provinceKey: clinicData.provinceKey,
          image: imageUrl,
          descriptionHTML: clinicData.descriptionHTML,
          describe: clinicData.describe,
        });
        const specialtyData = clinicData.specialtyData ? JSON.parse(clinicData.specialtyData) : [];
        let listClinicSpecialty = [];
        if (specialtyData.length) {
          listClinicSpecialty = specialtyData.map((spec) => ({
            clinicId: newClinic.id,
            specialtyId: spec.id,
          }));
        }
        await db.Clinic_Specialty.bulkCreate(listClinicSpecialty);
        resolve({
          message: Label.CREATE_CLINIC_SUCCESS,
          success: true,
          data: newClinic,
        });
      }
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getClinic = async (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const clinicData = await db.Clinic.findOne({
        where: { id: clinicId },
        include: [
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      let result = {};
      if (!clinicData) {
        result = {
          message: Label.NOT_EXISTED_CLINIC,
          success: false,
        };
      } else {
        result = {
          message: Label.SUCCESS,
          success: true,
          data: clinicData,
        };
      }
      resolve(result);
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const filterClinic = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, clinicName, provinceKey } = filter;
      const { count, rows } = await db.Clinic.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        distinct: true,
        where: {
          name: {
            [Op.like]: `%${clinicName ? clinicName : ""}%`,
          },
        },
        include: [
          {
            model: db.Code,
            as: "provinceData",
            required: provinceKey ? true : false,
            where: {
              key: {
                [Op.like]: `%${provinceKey ? provinceKey : ""}%`,
              },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        // nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: rows,
        pagination: {
          pageNum: getPageAmount(count, pageSize) < pageNum ? pageNum - 1 : pageNum,
          pageSize: pageSize,
          pageAmount: getPageAmount(count, pageSize),
          records: count,
        },
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const editClinic = async (clinicInfo, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: clinicInfo.id },
      });
      if (!clinic) {
        resolve({
          message: Label.NOT_EXISTED_CLINIC,
          success: false,
        });
      }
      const specialtyData = clinicInfo.specialtyData ? JSON.parse(clinicInfo.specialtyData) : [];
      let listClinicSpecialty = [];
      if (specialtyData.length) {
        listClinicSpecialty = specialtyData.map((spec) => ({
          clinicId: clinicInfo.id,
          specialtyId: spec.id,
        }));
      }
      await db.Clinic_Specialty.destroy({
        where: {
          clinicId: clinicInfo.id,
        },
      });
      const imageUrl = file ? await uploadImage(file) : "";
      await db.Clinic_Specialty.bulkCreate(listClinicSpecialty);
      const clinicUpdate = {
        name: clinicInfo.name,
        email: clinicInfo.email,
        provinceKey: clinicInfo.provinceKey,
        address: clinicInfo.address,
        image: imageUrl,
        descriptionHTML: clinicInfo.descriptionHTML,
        describe: clinicInfo.describe,
      };
      if (imageUrl) {
        const oldUrl = clinic.dataValues.image;
        if (oldUrl) {
          await deleteFile(oldUrl);
        }
      }
      const newClinic = await clinic.update(clinicUpdate);
      resolve({
        message: Label.UPDATE_SUCCESS,
        success: true,
        data: newClinic.dataValues,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const deleteClinic = async (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const clinic = await db.Clinic.findOne({
        where: { id: clinicId },
      });
      const oldUrl = clinic.dataValues.image;
      if (oldUrl) {
        await deleteFile(oldUrl);
      }
      await clinic.destroy();
      resolve({
        message: Label.DELETE_SUCCESS,
        success: true,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  addNewClinic: addNewClinic,
  getClinic: getClinic,
  filterClinic: filterClinic,
  editClinic: editClinic,
  deleteClinic: deleteClinic,
};
