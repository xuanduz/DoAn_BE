import bookingPatientService from "../../services/patient/appointment.patient.service";

const booking = async (req, res) => {
  try {
    const result = await bookingPatientService.booking(req.body);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

const getHistoryPatient = async (req, res) => {
  try {
    const result = await bookingPatientService.getHistoryPatient(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    console.log("err", err);
    return res.sendStatus(403);
  }
};

module.exports = {
  booking: booking,
  getHistoryPatient: getHistoryPatient,
};
