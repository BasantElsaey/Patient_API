const express = require('express')
const multer = require('multer');
const {
  multerStorage,uploadMedicalTest,deleteMedicalTest
  ,updateMedicalTest,getAllMedicalTests,getMedicalTestById
} = require('../controllers/medicalTests');
const { v4: uuidv4 } = require('uuid'); // generate unique id

const router = express.Router()

const {protect} = require('../controllers/usersAuth')


const upload = multer({ storage : multerStorage,fileFilter(req,file,cb){
    // tes47rdg@t.png --> /\ . $/
    if(!file.originalname.match(/\.(jpg|jpeg|png|jfif|pdf)$/)){
      return cb(new Error('An extension of this file is not supported'),null)
    }
    cb(null, true)
}});


// router.post("/tests/upload_files",upload.single('file'),uploadTest,resizeImage);

router.post('/:patientId/uploadtests',protect,upload.single('file'),uploadMedicalTest);
router.delete('/:patientId/medicaltests/:medicalTestId',deleteMedicalTest);
router.put('/:patientId/medicaltests/:medicalTestId',updateMedicalTest);
router.get('/:patientId/medicaltests',getAllMedicalTests);
router.get('/:patientId/medicaltests/:medicalTestId',getMedicalTestById);


module.exports = router;