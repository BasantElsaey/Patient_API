const router = require("express").Router();
const {
  createAppointment,
  getAppointmentsForDoctor,
  getPastAppointmentsForDoctor,
  deleteAppointment,

  getAvailableAppointments,
  bookAppointment,

} = require("../../controllers/doctor_controllers/appointments");
const authServices = require("../../controllers/doctor_controllers/doctorsAuth");

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createAppointment
);
router.get(
  "/myappointments",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAppointmentsForDoctor
);

router.get(
  "/mypastappointments",
  authServices.protect,
  authServices.allowTo("doctor"),
  getPastAppointmentsForDoctor
);

router.delete(
  "/cancelappointment/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  deleteAppointment
);

// // Get available appointments for patients to choose from
router.get('/appointments/available', getAvailableAppointments);

// Book an available appointment
router.put('/appointments/book', bookAppointment);


module.exports = router;
