const {
    signup,
    login,
    forgotPassword,
    verifyPassResetCode,
    resetPassword,
  } = require("../../controllers/doctor_controllers/doctorsAuth");
  
  const {
    signupValidator,
    loginValidator,
    forgotPasswordValidator,
    verifyPassResetCodeValidator,
    resetPasswordValidator,
  } = require("../../utils/validations/doctorValidators/authValidator");
  
  const router = require("express").Router();
  
  router.post("/signup", signupValidator, signup);
  router.post("/login", loginValidator, login);
  router.post("/forgotpassword", forgotPasswordValidator, forgotPassword);
  router.post(
    "/verifyResetCode",
    verifyPassResetCodeValidator,
    verifyPassResetCode
  );
  router.put("/resetPassword", resetPasswordValidator, resetPassword);
  
  module.exports = router;
  