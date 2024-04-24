const mongoose = require("mongoose");
const Patient = require('../Patient')

const AppointmentsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["Meeting", "Session", "meeting", "session"],
    required: true,
  },
  note: String,
  
  // to determine the availablity of an appointment
  available: {
    type: Boolean,
    default: true,
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  patient : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  }
});

const Appointment = mongoose.model('Appointment',AppointmentsSchema)
module.exports = Appointment

