const express = require('express');
const auth = require('../middlewares/auth')
const {
  signupValidator,
  loginValidator,
} = require('../utils/validations/authValidator');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  getMe,
  protect,
} = require('../controllers/usersAuth');



const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyPassResetCode);
router.put('/resetPassword', resetPassword);
router.get('/me',auth,getMe)

module.exports = router;
