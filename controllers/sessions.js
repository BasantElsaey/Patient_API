const Patient = require('../models/Patient')
const mongoose = require('mongoose');
const Session = require('../models/Session')
const Belt = require('../models/Belt')
const { MongoClient } = require('mongodb');


// @desc Check belt connection and handle patient values
// @route GET /api/v1/session/belt/check-connection
// @access Private/protected
 exports.checkCoonnectionToBelt = async (req, res) => {

  const  {patientId} = req.params
  //  const { temperature, pressure, weight } = req.body;
 
   try {
     // Check if the belt is connected for the specified patient
     const belt = await Belt.findOne({ patient: patientId });
 
     if (!belt) {
       return res.status(404).json({ error: 'Belt not found' });
     }
 
     // Check if the belt is connected
     if (!belt.isConnectedToBluetooth) {
       return res.status(400).json({ message: 'Belt is not connected to Bluetooth' });
     }
     
        return res.status(200).json({ 
        message: "Belt is connected to Bluetooth , you must enter values of temperature , pressure and weight to start session" });
        }
      
      catch(err){
        res.status(500).json({ error : "Internal Server Error"})
      }
    }
      
//      // Check temperature and pressure values
//      if ((pressure < 100 || pressure > 180) || (temperature < 36 || temperature > 38)) {
//        return res.status(400).json({ message: 'You cannot start the session. Please call the doctor.' });
//      }
 
//      // Create a new session
//      const session = new Session({
//        temperature,
//        pressure,
//        weight,
//        patient: patientId,
       
//      });
 
//      // Save the session to the database
//      await session.save();
 
//      // Respond with success message
//      res.json({ message: 'You are ready to start the session' });
//    } catch (error) {
//      console.error(error);
//      res.status(500).json({ error: 'Internal Server Error' });
//    }
//  }


 ////////////////////////////////////////////////////////////////////////////

 /**
  * create timer of session , session duration is 2 hours 
  * each session is stored in database 
  * store completed , delayed , min hours (12) ,total sessions
  * create api for sessions (POST,GET,UPDATE,DELETE) of each patient
  * -- name of session , date , time
  */




// @desc Create a new session for a patient
// @route POST /api/v1/session/patients/:patientId/sessions
// @access Public
exports.createSessionForPatient = async (req, res) => {
  const { patientId } = req.params;
  const { sessionName,temperature, pressure, weight } = req.body;

  // Check if temperature and pressure are within the valid range
  if ((pressure < 100 || pressure > 180) || (temperature < 36 || temperature > 38)) {
    return res.status(400).json({ message: "You can't start the session. Please call the doctor." });
  }

  // Calculate session duration
  const duration = 2 * 60 * 60 * 1000; // 2 hours
  
  try {
    // Create a new session
    const session = new Session({
      sessionName,
      temperature,
      pressure,
      weight,
      patient: patientId,
      startTime: new Date(),
      duration,
    });
    
    // session.totalSessions = session.completedSessions + session.delayedSessions;
    // Save the session to the database
    // await session.save();

    // Start the session timer
    setTimeout(async () => {
       // Increment total sessions and moving pointer
        session.totalSessions += 1;
        session.movingPointer += 2;
      // Update session statistics when the session is finished
      session.completedSessions += 1;
      session.delayedSessions = session.totalSessions - session.completedSessions;

      // Update the session in the database
      await session.save();
    }, duration);

    res.status(201).json({ message: "You are ready to start the session." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Get session statistics for a patient
// @route GET /api/v1/session/patients/:patientId/session-statistics
// @access Public
exports.getSessionStatisticsForPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const patientSessions = await Session.find({ patient: patientId });

    const completedSessions = patientSessions.filter(session => session.completedSessions === session.totalSessions);
    const delayedSessions = patientSessions.filter(session => session.completedSessions < session.totalSessions);
    const minHours = 12;
    const totalSessions = patientSessions.length;
    

    res.json({
      patient : patientId,
      completedSessions: completedSessions.length,
      delayedSessions: delayedSessions.length,
      minHours,
      totalSessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// @desc Get session of a specific patient
// @route GET /api/v1/session/:sessionId/patients/:patientId/
// @access Public
exports.getSessionForPatient = async (req, res) => {
  const { patientId, sessionId } = req.params;

  try {
    // Find the session for the patient
    const session = await Session.findOne({ _id: sessionId, patient: patientId });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// @desc Get all sessions of a specific patient
// @route GET /api/v1/session/:sessionId/patients/:patientId/allsessions
// @access Public
exports.getAllSessionsForPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Find all sessions for the patient
    const sessions = await Session.find({ patient: patientId });

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// @desc Update session of a specific patient
// @route PUT /api/v1/session/:sessionId/patients/:patientId/
// @access Public
exports.updateSessionForPatient = async (req, res) => {
  const { patientId, sessionId } = req.params;
  const { sessionName,temperature, pressure, weight } = req.body;

  try {
    // Find and update the session for the patient
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, patient: patientId },
      { sessionName,temperature, pressure, weight },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    res.status(200).json({
      message : "Session is updated successfully",
      session
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// @desc Delete session of a specific patient
// @route DELETE /api/v1/session/:sessionId/patients/:patientId/
// @access Public

exports.deleteSessionForPatient = async (req, res) => {
  const { patientId, sessionId } = req.params;

  try {
    // Find and delete the session for the patient
    const session = await Session.findOneAndDelete({ _id: sessionId, patient: patientId });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    res.status(200).json({ message: 'Session is deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
