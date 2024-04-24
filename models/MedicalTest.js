const mongoose = require('mongoose');

const medicalTestSchema = new mongoose.Schema({

    medicalTestName : {
        type : String,
    },

    image : {
        data : Buffer,
    }, 
    file : {
        type : String
    },
     filename: {
        type: String,
      },
      originalname : {
        type : String,
      },
      contentType: {
        type: String,
        
      },
      contentLength: {
        type: Number,
       
      },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
   
    timestamp: { type: Date, default: Date.now },
})

// To retrieve the patient information for a medical test, you can use population:

// MedicalTest.findById(testId)
//   .populate('patient')
//   .exec((err, test) => {
//     // Here, the test.patient field will contain the populated patient document
//   });

medicalTestSchema.pre(/^find/, function (next) {
    this.populate({ path: "patient", select: "username" })
    next();
  });
  

const MedicalTest = mongoose.model('MedicalTest',medicalTestSchema)
module.exports = MedicalTest
