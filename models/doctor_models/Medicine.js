const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicineName: {
      type: String,
      required: "true",
    },
  },
  { timestamps: true }
);

medicineSchema.pre(/^find/, function (next) {
  this.populate({ path: "patient", select: "username" })
  next();
});
const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
