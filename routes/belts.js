const express = require('express')

const {
    getBeltsForPatient, 
    getBeltByIdForPatient, 
    createBeltForPatient, 
    deleteBeltForPatient, 
    updateBeltForPatient,

} = require('../controllers/belts')

const router = express.Router()

router.get('/patients/:patientId/belts',getBeltsForPatient)
router.get('/patients/:patientId/belts/:beltId',getBeltByIdForPatient)
router.post('/patients/:patientId/belts',createBeltForPatient)
router.delete('/patients/:patientId/belts/:beltId',deleteBeltForPatient)
router.put('/patients/:patientId/belts/:beltId',updateBeltForPatient)



module.exports = router;