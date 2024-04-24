const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

// // @desc    Update account information
// // @route   POST /api/v1/settings/:patientId/updateAccountInformation
// // @access  Private/protected

exports.updateAccountInformation = async (req, res) => {
    try {
      const { username, age, gender } = req.body;
      const patient = await Patient.findById(req.patient._id);
  
      // Update the fields if provided
      if (username) patient.username = username;
      if (age) patient.age = age;
      if (gender) patient.gender = gender;
      await patient.save();
  
      res.status(200).json({ message: 'Account information updated successfully' });
      }
  
     
    catch (error) {
      res.status(500).json({ error: 'Failed to update account information' });
    }
}
  
  // Get privacy information
  exports.getPrivacy = async (req, res) => {
    try {
      const patient = await Patient.findById(req.patient._id).select('email countryCode mobileNumber');
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get privacy information' });
    }
  };
  
  // Update privacy information
  exports.updatePrivacy = async (req, res) => {
    try {
      const { email, countryCode, mobileNumber } = req.body;
      const patient = await Patient.findById(req.patient._id);
  
      // Update the fields if provided
      if (email) patient.email = email;
      if (countryCode) patient.countryCode = countryCode;
      if (mobileNumber) patient.mobileNumber = mobileNumber;
    
      await patient.save();
  
      res.status(200).json({ message: 'Privacy information updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update privacy information' });
    }
  };


// Handle changing password in account information
exports.getAccountInfo = async (req, res) => {
    try {
      const patient = await Patient.findById(req.patient._id).select('username age gender');
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get Account information' });
    }
  
};
