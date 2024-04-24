const crypto = require('crypto') // to reset password
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const patientSchema = new mongoose.Schema({
    //properties
    username:{
        type:String,
        required:true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
      },
      password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [128, 'Password must be less than 128 characters long'],
        validate: {
          validator: function(value) {
            // Require at least one uppercase letter, one lowercase letter, one special character and one number
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
            return regex.test(value);
          },
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number'
        }
      },
      passwordChangedAt : Date,
      passwordResetCode : String,
      passwordResetExpires : Date,
      passwordResetVerified : Boolean,

      role: {
       type: String, 
       enum: ["doctor", "patient"],
       default:"patient", 
      },

      countryCode : {
     type : String,
     required : true,
     maxlength : 4
    },
    mobileNumber :{
        type : String,
        required : true,
        maxlength : 11
    },
    age:{
        type:Date,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    profileImg: {
      type: String,
    },
    barcode : {
      type : Number,
      required : true
    },
    profileImg : {
      type : String,
    },
    loginCount: {
        type: Number,
        default: 0
      },

    weight :{
      type : Number,
    },
    pressure:{
       type : Number,
    },
    temperature :{
     type : Number,
    },
    sufferedFromDisease : {
       type : String,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,

    
    movingPointer: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    completedSessions: {
      type: Number,
      default: 0,
    },
    delayedSessions: {
      type: Number,
      default: 0,
    },
    weeklySessionHours: {
      type: Number,
      default: 12,
    },
   

  },

    
  {
   timestamps: true 
  })
  
  //////////////////////////////////////////////////////////////////////////////////
  patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });


// //////////////////////////////////////////////////////////////////////////////////
patientSchema.virtual("sessions", {
  ref: "Session",
  foreignField: "patient",
  localField: "_id",
});
patientSchema.virtual("medicalTests", {
  ref: "MedicalTest",
  foreignField: "patient",
  localField: "_id",
});

patientSchema.virtual("medicines", {
  ref: "Medicine",
  foreignField: "patient",
  localField: "_id",
});

///////////////////////////////////////////////////////////////////////////////////////////
//create token
patientSchema.methods.createToken = function(){
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token
}
// delete password
patientSchema.methods.toJSON = function(){
  const patientObject = this.toObject()
  delete patientObject.password
  delete patientObject.__v
  delete patientObject.barcode
  return patientObject
}
const Patient = mongoose.model('Patient',patientSchema)
module.exports = Patient