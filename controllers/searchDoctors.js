const Doctor = require('../models/doctor_models/Doctor')
const Patient = require('../models/Patient')
const geocoder = require('../utils/geocoder')
const Appointment = require('../models/doctor_models/Appointment')
// Controller function to create a new doctor
// exports.createDoctor =  async(req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       phone,
//       ID,
//       location,
//       coordinates,
//       experience,
//       speciality,
//     } = req.body;

//     const doctor = new Doctor({
//       name,
//       email,
//       password,
//       phone,
//       ID,
//       location: 'Point',
//       coordinates: [geocodeResponse[0].longitude, geocodeResponse[0].latitude],
//       experience,
//       speciality,
//     });

//     await doctor.save();

//     res.status(201).json({ success: true, data: doctor });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Server Error' });
//   }
// }



exports.searchDoctorsByLocationAndName = async(req,res) => {
  const {city,doctor_name,available_dates} = req.query
  let query = {
   
};

if (city !== "" || city !== null) {
  query.city = city;
   
}
if(doctor_name !== "" || doctor_name !== null){
  query.name = doctor_name;
}


if(available_dates !== "" || available_dates !== null){
  const notExistingSchedule = await Appointment.find({
    date : {
      $ne: available_dates
    }
  

  });

  if (notExistingSchedule.length > 0) {
    const doctors_ids = notExistingSchedule.map(schedule => schedule.doctor);

    query._id = { $in: doctors_ids };
  }

}
const doctors = await Doctor.find(query).lean()
console.log(query)
 const doctorsWithAppointments = doctors?.map(doctor => {
  notExistingSchedule.forEach(schedule => {
    if (schedule.doctor.toString() === doctor._id.toString()) {
      doctor.appointments.push(schedule);
    }
  });
 })
 return doctorsWithAppointments 
}
//   const doctors = await Doctor.find({
//     $and: [
//       { name: { $regex: name, $options: 'i' } }, // Case-insensitive regex search for the name
//       {
//         location: {
//           $near: {
//             $geometry: {
//               type: 'Point',
//               coordinates: location,
//             },
//           },
//         },
//       },
//     ],
//   })
//     .populate('patientRatings.patient') // Populate patient references in the patientRatings array
//     .select('name patientRatings.rating speciality');

//   return doctors;
// }



