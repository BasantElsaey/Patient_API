const express = require('express')
const { 
    createSession, 
    checkCoonnectionToBelt,
    getSessionStatisticsForPatient,
    createSessionForPatient,
    getSessionForPatient,
    getAllSessionsForPatient,
    updateSessionForPatient,
    deleteSessionForPatient,
} = require('../controllers/sessions')

const router = express.Router()


// // Home page route
// router.get('/home', isLoggedIn, (req, res) => {
//     const { username, profileImg } = req.user;
  
//     // Send a welcome message along with the username and image
//     res.send(`Hi,Welcome Back,<br>${username},<br><img src="${profileImg}" alt="Profile Image">`);
//   });


router.get('/belt/check-connection/:patientId',checkCoonnectionToBelt)
router.post('/patients/:patientId/sessions',createSessionForPatient)
router.get('/patients/:patientId/session-statistics',getSessionStatisticsForPatient)

router.get('/:sessionId/patients/:patientId',getSessionForPatient)
router.get('/patients/:patientId/allsessions',getAllSessionsForPatient)
router.put('/:sessionId/patients/:patientId',updateSessionForPatient)
router.delete('/:sessionId/patients/:patientId',deleteSessionForPatient)

module.exports = router;