const asyncHandler = require("express-async-handler");
const Doctor = require("../../models/doctor_models/Doctor");
const Medicine = require("../../models/doctor_models/Medicine");
const Patient = require('../../models/Patient')
const ApiError = require("../../utils/apiError");

// @desc    create Medicine to patient
// @route   POST /api/v1/patients/:patientId/medicine
// @access  Protected
exports.createMedicineOnSpecificPatient = asyncHandler(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return next(new ApiError("doctor not found", 404));
    }
    if (!doctor.patients.includes(req.params.patientId)) {
      return next(
        new ApiError(
          "the patient not belong to you to add medicine to him",
          401
        )
      );
    }
    const medicine = await Medicine.create({
      patient: req.params.patientId,
      medicineName: req.body.medicineName,
    });
    res.status(200).json(medicine);
  }
);

// @desc    get all Medicine on patient
// @route   GET /api/v1/patients/:patientId/medicine
// @access  Protected
exports.getAllMedicineOnSpecificPatient = asyncHandler(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return next(new ApiError("doctor not found", 404));
    }
    if (!doctor.patients.includes(req.params.patientId)) {
      return next(
        new ApiError("the patient not belong to you to access it", 401)
      );
    }
    const medicine = await Medicine.find({
      patient: req.params.patientId,
    });
    res.status(200).json(medicine);
  }
);

// @desc    get specific Medicine on patient
// @route   GET /api/v1/medicine/:id
// @access  Protected
exports.getSpecificMedicineOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    return next(new ApiError("The medicine not found", 404));
  }
  if (!doctor.patients.includes(medicine.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his medicine", 401)
    );
  }
  res.status(200).json(medicine);
});

// @desc    update Medicine on patient
// @route   PUT /api/v1/medicine/:id
// @access  Protected
exports.updateMedicineOnPatient = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.user._id);
  if (!doctor) {
    return next(new ApiError("doctor not found", 404));
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    return next(new ApiError("The medicine not found", 404));
  }
  if (!doctor.patients.includes(medicine.patient._id)) {
    return next(
      new ApiError("The patient not belong to you to access his medicine", 401)
    );
  }
  medicine.medicineName = req.body.medicineName || medicine.medicineName;
  const updatedMedicine = await medicine.save();
  res.status(200).json(updatedMedicine);
});

/////////////////////////////////////////////////////////////////////////////////

// view for a patient

// @desc    get all Medicines on doctor
// @route   GET /api/v1/patients/:doctorId/medicines
// @access  Protected
exports.getAllMedicinesOnSpecificDoctor = asyncHandler(
  async (req, res, next) => {
    const patient = await Patient.findById(req.user._id);
    if (!patient) {
      return next(new ApiError("patient not found", 404));
    }
    if (!patient.doctors.includes(req.params.doctorId)) {
      return next(
        new ApiError("the doctor not belong to you to access it", 401)
      );
    }
    const medicine = await Medicine.find({
      doctor: req.params.doctorId,
    });
    res.status(200).json(medicine);
  }
);

// @desc    get specific Medicine on doctor
// @route   GET /api/v1/medicine/:id
// @access  Protected
exports.getSpecificMedicineOnDoctor = asyncHandler(async (req, res, next) => {
  const patient = await Patient.findById(req.user._id);
  if (!patient) {
    return next(new ApiError("patient not found", 404));
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    return next(new ApiError("The medicine not found", 404));
  }
  if (!patient.doctors.includes(medicine.doctor._id)) {
    return next(
      new ApiError("The doctor not belong to you to access his medicine", 401)
    );
  }
  res.status(200).json(medicine);
});
