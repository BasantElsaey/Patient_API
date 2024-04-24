const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const geocoder = require('../../utils/geocoder')

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name required"],
    minLength: [3, "Too short user name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email Required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password required"],
    minLength: [8, "Too short password"],
  },
  phone: String,
  ID: String,
  location: {
    type : String,
    enum : ['Point']
  },
  coordinates : {
    type : [Number],
    index : '2dsphere'
  },

  experience: Number,
 
  // rating: {
  //   type: Number,
  //   default: 0,
  // },
available_dates : {
  type : [Date],
  default : []
},

  speciality: String,
  role: {
    type: String,
    default: "Doctor",
  },
  isVerifiredID: {
    type: Boolean,
    default: false,
  },
   patientRatings : [
    {
      patientName : String,
      rating : Number,
    }
   ],
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
});

DoctorSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

///////////////////////////////////////////////////////////

// // Geocode & create location field
// DoctorSchema.pre('save',async function(next){
//   const loc = await geocoder.geocode(this.address)
//   this.location = {
//     type : 'Point',
//     coordinates : [loc[0].longitude,loc[1].latitude],
//     formattedAddress : loc[0].formattedAddress,
//     street : loc[0].streetName,
//     city :   loc[0].city,
//     state : loc[0].stateCode,
//     zipcode : loc[0].zipcode,
//     country : loc[0].countryCode,
//   }
//   // Do not save address in DB
//   this.address = undefined;
//   next();
// })

DoctorSchema.pre('save', async function(next) {
  if (!this.address) {
    // Handle the case when 'address' property is not defined
    next();
    return;
  }

  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  console.log(this.address)
  // Do not save address in DB
  // this.address = undefined;
  next();
});




const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;









const locations = [
  {
   city : 'Cairo',
   state : 'Egypt',
   country : 'Egypt',
   formattedAddress : 'Egypt, Cairo',
   street : 'Cairo',
   zipcode : '123456',
   longitude : 123,
   latitude : 123,
  },
  {
    city : 'Elmahallah',
    state : 'Egypt',
    country : 'Egypt',
    formattedAddress : 'Egypt, Elmahallah',
    street : 'Elmahallah',
    zipcode : '123456',
    longitude : 123,
    latitude : 123,
  }
]

function findLongitudeAndLatitude(city) {
  const location = locations.find((location) => location.city.toLowerCase() === city.toLowerCase());
  if (location) {
    return {
      longitude: location.longitude,
      latitude: location.latitude,
    };
  } else {
    return null;
  }

}


const location_loc = findLongitudeAndLatitude('caIro')
console.log(location_loc)




