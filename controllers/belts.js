const Patient = require('../models/Patient')
const mongoose = require('mongoose');
const Belt = require('../models/Belt')


// @desc Get belts for a patient
// @route GET /api/v1/belts/patients/:patientId/belts
// @access Public
exports.getBeltsForPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const belts = await Belt.find({ patient: patientId });
    res.json(belts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Get a belt by ID for a patient
// @route GET /api/v1/belts/patients/:patientId/belts/:beltId
// @access Public
exports.getBeltByIdForPatient = async (req, res) => {
  const { patientId, beltId } = req.params;
  try {
    const belt = await Belt.findOne({ _id: beltId, patient: patientId });
    if (!belt) {
      return res.status(404).json({ error: 'Belt not found' });
    }
    res.json(belt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Create a new belt for a patient
// @route POST /api/v1/belts/patients/:patientId/belts
// @access Public
exports.createBeltForPatient = async (req, res) => {
  const { patientId } = req.params;
  const { name, isConnectedToBluetooth, version, price, charge } = req.body;
  try {
    const belt = new Belt({ name, isConnectedToBluetooth, version, price, charge, patient: patientId });
    await belt.save();
    res.status(201).json(belt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Update a belt for a patient
// @route PUT /api/v1/belts/patients/:patientId/belts/:beltId
// @access Public
exports.updateBeltForPatient = async (req, res) => {
  const { patientId, beltId } = req.params;
  const { name, isConnectedToBluetooth, version, price, charge } = req.body;
  try {
    const belt = await Belt.findOneAndUpdate(
      { _id: beltId, patient: patientId },
      { name, isConnectedToBluetooth, version, price, charge },
      { new: true }
    );
    if (!belt) {
      return res.status(404).json({ error: 'Belt not found' });
    }
    res.json({
        message : "Belt is updated successfully",
        belt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Delete a belt for a patient
// @route DELETE /api/v1/belts/patients/:patientId/belts/:beltId
// @access Public
exports.deleteBeltForPatient = async (req, res) => {
  const { patientId, beltId } = req.params;
  try {
    const belt = await Belt.findOneAndDelete({ _id: beltId, patient: patientId });
    if (!belt) {
      return res.status(404).json({ error: 'Belt not found' });
    }
    res.json({ message: 'Belt deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};