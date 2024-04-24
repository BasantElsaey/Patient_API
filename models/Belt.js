const mongoose = require('mongoose');

const beltSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },

    isConnectedToBluetooth: {
      type: Boolean,
      default: false,
    },

    version : {
        type : String,
        required : true,
    },
    price : {
       type : Number,
       required : true,
    },
 
  charge: {
    type : String, 
    required : true,
  },
 
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
    

})

const Belt = mongoose.model('Belt',beltSchema)
module.exports = Belt


// pressure --> > 180 or < 100 --> not start session
// temperature --> > 38 or < 36 --> not session
