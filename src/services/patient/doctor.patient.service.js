import db from "../../models";
import { Label } from "../../utils/labels/label";
import { getListDateNextWeek, getPageAmount, getQueryWithId } from "../../utils/pagingData";
const { Op } = require("sequelize");

const filterDoctor = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, doctorName, clinicId, specialtyId, minPrice, maxPrice } = filter;

      db.Doctor.findAndCountAll({
        offset: (+pageNum - 1) * +pageSize,
        limit: +pageSize,
        where: {
          fullName: {
            [Op.like]: `%${doctorName ? doctorName : ""}%`,
          },
          price: {
            [Op.gte]: minPrice ? +minPrice : 0,
            [Op.lte]: maxPrice ? +maxPrice : 100000000,
          },
        },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            ...getQueryWithId(specialtyId),
          },
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: {
              exclude: ["email", "createdAt", "updatedAt"],
            },
            ...getQueryWithId(clinicId),
          },
          {
            model: db.Code,
            as: "positionData",
            // require: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        nest: true,
        distinct: true,
      }).then(({ count, rows }) => {
        const listIds = rows.map((item) => item.id);
        const listDoctor = specialtyId
          ? listIds.map((id) =>
              db.Doctor.findOne({
                where: {
                  id: id,
                },
                attributes: {
                  exclude: ["password", "accessToken", "refreshToken"],
                },
                include: [
                  {
                    model: db.Specialty,
                    as: "specialtyData",
                    required: false,
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.Clinic,
                    as: "clinicData",
                    attributes: {
                      exclude: ["email", "createdAt", "updatedAt"],
                    },
                    ...getQueryWithId(clinicId),
                  },
                  {
                    model: db.Code,
                    as: "positionData",
                    // require: false,
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                ],
                nest: true,
              })
            )
          : rows;
        Promise.all(listDoctor).then((data) => {
          resolve({
            message: Label.SUCCESS,
            success: true,
            data: data,
            pagination: {
              pageNum: getPageAmount(count, pageSize) < pageNum ? pageNum - 1 : pageNum,
              pageSize: pageSize,
              pageAmount: getPageAmount(count, pageSize),
              records: count,
            },
          });
        });
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getListFeaturedDoctor = async (pageNum, pageSize) => {
  return await db.Doctor.findAll({
    offset: (+pageNum - 1) * +pageSize,
    limit: +pageSize,
    // group: ["Doctor.id"],
    // subQuery: false,
    attributes: {
      // include: [[Sequelize.fn("COUNT", Sequelize.col("appointmentData.id")), "appCount"]],
      exclude: ["password"],
    },
    // order: [[Sequelize.literal("appCount"), "DESC"]],
    // include: [
    //   {
    //     model: db.Appointment,
    //     as: "appointmentData",
    //     required: true,
    //     attributes: [],
    //   },
    // ],
  });
};

const filterFeaturedDoctor = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pageNum, pageSize, doctorName, clinicId, specialtyId, minPrice, maxPrice } = filter;

      const listDoctorFreatured = await getListFeaturedDoctor(pageNum, pageSize);
      const listId = listDoctorFreatured.map((doctor) => doctor.id);
      const listDoctor = await db.Doctor.findAll({
        where: {
          id: listId,
          fullName: {
            [Op.like]: `%${doctorName ? doctorName : ""}%`,
          },
          price: {
            [Op.gte]: minPrice ? +minPrice : 0,
            [Op.lte]: maxPrice ? +maxPrice : 1000000000,
          },
        },
        attributes: {
          exclude: ["password", "accessToken", "refreshToken"],
        },
        include: [
          {
            model: db.Schedule,
            as: "scheduleData",
            required: false,
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            ...getQueryWithId(specialtyId),
          },
          {
            model: db.Code,
            as: "provinceDoctorData",
            // require: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Code,
            as: "positionData",
            // require: false,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: db.Clinic,
            as: "clinicData",
            ...getQueryWithId(clinicId),
          },
        ],
        nest: true,
      });
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listDoctor,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listScheduleValid = await db.Schedule.findAll({
        where: {
          doctorId: doctorId,
          date: getListDateNextWeek(),
        },
        attributes: ["date"],
        group: ["date"],
        raw: true,
      });

      Promise.all(listScheduleValid).then(async (listSche) => {
        const listScheValue = listSche.length ? listSche.map((sche) => sche.date) : [];
        const querySchedule = listSche.length
          ? {
              where: {
                currentNumber: 0,
                date: getListDateNextWeek(),
              },
              required: true,
            }
          : {
              where: {
                date: "",
              },
              required: false,
            };

        const doctorData = await db.Doctor.findOne({
          where: {
            id: doctorId,
          },
          attributes: {
            exclude: ["password", "accessToken", "refreshToken"],
          },
          include: [
            {
              model: db.Schedule,
              as: "scheduleData",
              attributes: {
                exclude: ["updatedAt", "createdAt", "currentNumber", "maxNumber"],
              },
              ...querySchedule,
            },
            {
              model: db.Specialty,
              as: "specialtyData",
              attributes: {
                exclude: ["descriptionHTML"],
              },
            },
            {
              model: db.Clinic,
              as: "clinicData",
              attributes: {
                exclude: ["descriptionHTML"],
              },
            },
            {
              model: db.Code,
              as: "positionData",
              attributes: {
                exclude: ["updatedAt", "createdAt"],
              },
            },
          ],
          nest: true,
        });

        resolve({
          message: Label.SUCCESS,
          success: true,
          data: doctorData,
        });
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

const getRelateDoctor = async (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const specialtyIds = await db.Doctor_Specialty.findAll({
        attributes: ["specialtyId"],
        where: {
          doctorId: doctorId,
        },
      });
      let listDoctorLelate = [];
      const listId = specialtyIds.map((spec) => spec.specialtyId);
      const doctors = await db.Doctor_Specialty.findAll({
        attributes: ["doctorId"],
        where: {
          specialtyId: [listId],
        },
      });
      let listDoctorLelateIds = doctors
        .map((doctor) => doctor.doctorId)
        .filter((spec) => spec != doctorId);

      if (listDoctorLelateIds.length) {
        listDoctorLelate = await db.Doctor.findAll({
          offset: 0,
          limit: 3,
          where: {
            id: listDoctorLelateIds,
          },
          attributes: {
            exclude: ["password", "accessToken", "refreshToken", "descriptionHTML"],
          },
          include: [
            {
              model: db.Specialty,
              as: "specialtyData",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: db.Clinic,
              as: "clinicData",
              attributes: {
                exclude: ["email", "createdAt", "updatedAt"],
              },
            },
          ],
          nest: true,
        });
      }
      resolve({
        message: Label.SUCCESS,
        success: true,
        data: listDoctorLelate,
      });
    } catch (err) {
      console.log("err", err);
      reject();
    }
  });
};

module.exports = {
  getDoctor: getDoctor,
  filterDoctor: filterDoctor,
  getRelateDoctor: getRelateDoctor,
  filterFeaturedDoctor: filterFeaturedDoctor,
};
