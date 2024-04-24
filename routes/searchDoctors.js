const express = require('express')

const {searchDoctorsByLocationAndName, createDoctor} = require('../controllers/searchDoctors')

const router = express.Router()

console.log('Hello')
router.post('/seachDoctorsbyLocation',searchDoctorsByLocationAndName)
// router.post('/createdoctor',createDoctor)

module.exports = router;