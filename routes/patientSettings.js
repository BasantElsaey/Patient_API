const express = require('express')

const auth = require('../middlewares/auth');

const {
    getPrivacy,
    updateAccountInformation,
    updatePrivacy,
    getAccountInfo
} = require('../controllers/patientSettings')

const router = express.Router()


const {protect} = require('../controllers/usersAuth')

router.patch('/updateAccountInformation',auth,updateAccountInformation)
router.patch('/updatePrivacy',auth,updatePrivacy)
router.get('/getprivacy',auth,getPrivacy)
router.get('/getAccountInfo',auth,getAccountInfo)



module.exports = router;
  