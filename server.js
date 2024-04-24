const express = require('express')
const path = require('path')
const dotenv = require('dotenv') 
require("dotenv").config()

const mongodb = require('mongodb');
const cors = require('cors');
const multer = require('multer')

// const cookieParser = require('cookie-parser');

// database config
const db = require('./config/db')



// models
const Patient = require('./models/Patient')
const Session = require('./models/Session')
const Appointment = require('./models/doctor_models/Appointment')
const Belt = require('./models/Belt')
const MedicalTest = require('./models/MedicalTest')
const Medicine = require('./models/doctor_models/Medicine')
const Doctor = require('./models/doctor_models/Doctor')
const PatientRequests = require('./models/PatientRequests') 


// routes 
const authRoutes = require('./routes/auth')
const doctorRoutes = require('./routes/doctor_routes/doctorAuth')
const medicalTests = require('./routes/medicaltests')
// const userRoutes = require('./routes/users')
const sessionRoutes = require('./routes/sessions')
const beltRoutes = require('./routes/belts')
// const appointmentRoutes = require('./routes/appointments');
const appointmentRoute = require('./routes/doctor_routes/appointmentRoute')
const medicineRoutes = require('./routes/doctor_routes/medicineRoute')
const searchDoctors = require('./routes/searchDoctors')
const patientSettings = require('./routes/patientSettings')

const app = express()

// Middlewares
// Body parser


app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Cookie parser
// app.use(cookieParser);

// app.use('/auth',authRoutes)
app.use('/api/v1/tests',medicalTests)
app.use('/api/v1/session',sessionRoutes)
app.use('/api/v1/belts',beltRoutes)

// app.use('/appointment',appointmentRoutes)
app.use("/api/v1/appointments", appointmentRoute);
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/medicine", medicineRoutes);
// app.use('/api/v1/auth', doctorRoutes);
app.use('/api/v1/search',searchDoctors)
app.use('/api/v1/settings',patientSettings)

app.use(cors())

// Error Handling
app.use((err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message : err.message
    })
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port " + process.env.PORT)
})

// api-key = https://geocode.xyz/[Egypt]&auth=798752646869798822538x86490%20