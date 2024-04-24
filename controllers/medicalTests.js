const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // generate unique id
const sharp = require('sharp')
const Patient = require('../models/Patient')
const mongoose = require('mongoose');
const MedicalTest = require('../models/MedicalTest')

// Disk Storage engine
const multerStorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'uploads/medicalTests') // null --> no errors
    },
    filename : function(req,file,cb){
        // test-${id} , Date.now() .jpg
        const extension = file.mimetype.split("/")[1]
        const filename = `test-${uuidv4()}-${Date.now()}.${extension}` // unique filename
        cb(null,filename)
    },
})



const upload = multer({ storage : multerStorage });
/////////////////////////////////////////////////////////////////////////////////

// @desc    uploading medical test of a patient
// @route   POST /api/v1/tests/:patientId/uploadtests

exports.uploadMedicalTest = async(req,res) => {
    console.log(req.body);
    // // console.log(req.files); // array of files
    // console.log(req.file)
  
      const {patientId} = req.params
     // Create a new MedicalTest document
     const medicalTest = new MedicalTest({
        patient : patientId,
        medicalTestName: req.body.medicalTestName,
        filename: req.file.filename,
        contentType: req.file.mimetype,
        contentLength: req.file.size,
        originalname : req.file.originalname
      });

      await medicalTest.save();
      
      const patient = await Patient.findById(patientId);
      await patient.save();

      res.json({ 
        message: 'Medical test is uploaded successfully' ,
        file : req.file
    });
    }

//////////////////////////////////////////////////////////////////////////////////

// @desc    Delete medical test of a patient
// @route   DELETE /api/v1/tests/:patientId/medicaltests/:medicalTestId


exports.deleteMedicalTest = async (req, res) => {
  const { patientId, medicalTestId } = req.params;

  try {
    // Find the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await patient.save();
    // Delete the medical test from the database
    const medicalTest = await MedicalTest.findByIdAndDelete(medicalTestId)
    if(!medicalTest){
      return res.status(404).json({error : 'Medical test not found'})
    }
    res.json({ message: 'Medical test is deleted successfully' });
  } catch (err) {
    console.error('Error deleting medical test:', err);
    res.status(500).json({ error: 'Failed to delete medical test' });
  }
};

///////////////////////////////////////////////////////////////////////////////

// @desc    Update medical test of a patient
// @route   PUT /api/v1/tests/:patientId/medicaltests/:medicalTestId

  exports.updateMedicalTest = async(req, res) => {
    const { patientId, medicalTestId } = req.params;
    const updatedMedicalTest = req.body;
  
    try {
      // Find the medical test
      const medicalTest = await MedicalTest.findOne({
        _id: medicalTestId,
        patient: patientId,
       
      });
  
      if (!medicalTest) {
        return res.status(404).json({ error: 'Medical test not found for the patient' });
      }
  
      // Update the medical test
      medicalTest.set(updatedMedicalTest);
      await medicalTest.save();
  
      res.json({ message: 'Medical test is updated successfully' });
    } catch (err) {
      console.error('Error updating medical test:', err);
      res.status(500).json({ error: 'Failed to update medical test' });
    }
  }
  

/////////////////////////////////////////////////////////////////////////////

// @desc    get all medicaltests of a patient
// @route   GET /api/v1/tests/:patientId/medicaltests/

  exports.getAllMedicalTests = async(req, res) => {
    const { patientId } = req.params;
  
    try {
      // Find all medical tests for the patient
      const medicalTests = await MedicalTest.find({ patient: patientId });
      res.json(medicalTests);
    } catch (err) {
      console.error('Error retrieving medical tests:', err);
      res.status(500).json({ error: 'Failed to retrieve medical tests' });
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////

  // @desc    get medicaltest of a patient by id
  // @route   GET /api/v1/tests/:patientId/medicaltests/:medicalTestId

  exports.getMedicalTestById = async(req, res) => {
    const { patientId, medicalTestId } = req.params;
  
    try {
      // Find the medical test by ID and patient ID
      const medicalTest = await MedicalTest.findOne({
        _id: medicalTestId,
        patient: patientId,
      });
  
      if (!medicalTest) {
        return res.status(404).json({ error: 'Medical test not found for the patient' });
      }
  
      res.json(medicalTest);
    } catch (err) {
      console.error('Error retrieving medical test:', err);
      res.status(500).json({ error: 'Failed to retrieve medical test' });
    }
  }
  

