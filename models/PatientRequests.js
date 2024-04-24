const mongoose = require("mongoose");

const patientRequestsSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

patientRequestsSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient", select: "username" });
  next();
});

const PatientRequests = mongoose.model('PatientRequests',patientRequestsSchema)
module.exports = PatientRequests

