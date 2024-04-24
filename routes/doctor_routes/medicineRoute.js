const router = require("express").Router({ mergeParams: true });

const authServices = require("../../controllers/doctor_controllers/doctorsAuth");

const {
  createMedicineOnSpecificPatient,
  getAllMedicineOnSpecificPatient,
  getSpecificMedicineOnPatient,
  updateMedicineOnPatient,
  getAllMedicinesOnSpecificDoctor,
  getSpecificMedicineOnDoctor

} = require("../../controllers/doctor_controllers/medicines");

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  createMedicineOnSpecificPatient
);

router.get(
  "/",
  authServices.protect,
  authServices.allowTo("doctor"),
  getAllMedicineOnSpecificPatient,
  getAllMedicinesOnSpecificDoctor
);

router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  getSpecificMedicineOnPatient,
  getSpecificMedicineOnDoctor
);

router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("doctor"),
  updateMedicineOnPatient
);
module.exports = router;
