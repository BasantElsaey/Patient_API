const crypto = require('crypto');
const Patient = require('../models/Patient');
const authRoutes = require('../routes/auth')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');


// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {

  const {username,email,password,mobileNumber,countryCode,age,gender,barcode} = req.body
  let formattedCountryCode = countryCode.trim();
  if(!formattedCountryCode.startsWith('+')){
    formattedCountryCode = '+' + formattedCountryCode;
  }
  // 1- Create user
  const patient = await Patient.create({
    username,
    email,
    password,
    mobileNumber,
    countryCode : formattedCountryCode,
    age,
    gender,
    barcode
  });
 
  // 2- Generate token
  const token = patient.createToken();

  res.status(201).json({ data: patient, token });
}

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const patient = await Patient.findOne({ email: req.body.email });

  if (!patient || !(await bcrypt.compare(req.body.password, patient.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = patient.createToken();

  // Delete password from response
  delete patient._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: patient, token });
}
////////////////////////////////////////////////////////

// protect controller
exports.protect = async(req,res,next) =>{

  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
  }
  // Make sure token exists
  if(!token){
    return res.send('Not Authorized to access this route',401)
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    console.log(decoded)

    req.patient = await Patient.findById(decoded.id)
    next()

  }catch(err){
    return res.send('Not Authorized to access this route',401)
  
  }

}






// // @desc   make sure the user is logged in
// exports.protect = async (req, res, next) => {
//   // 1) Check if token exist, if exist get
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token) {
//     return next(
//       new ApiError(
//         'You are not login, Please login to get access this route',
//         401
//       )
//     );
//   }

//   // 2) Verify token (no change happens, expired token)
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   // 3) Check if user exists
//   const currentPatient= await Patient.findById(decoded.patientId);
//   if (!currentPatient) {
//     return next(
//       new ApiError(
//         'The user that belong to this token does no longer exist',
//         401
//       )
//     );
//   }

//   // 4) Check if user change his password after token created
//   if (currentPatient.passwordChangedAt) {
//     const passChangedTimestamp = parseInt(
//       currentPatient.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     // Password changed after token created (Error)
//     if (passChangedTimestamp > decoded.iat) {
//       return next(
//         new ApiError(
//           'User recently changed his password. please login again..',
//           401
//         )
//       );
//     }
//   }

//   req.patient = currentPatient;
//   next();
// }

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
    async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.patient.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  }

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  // 1) Get user by email
  const patient = await Patient.findOne({ email: req.body.email });
  if (!patient) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  patient.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  patient.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  patient.passwordResetVerified = false;

  await patient.save();

  // 3) Send the reset code via email
  const message = `Hi ${patient.username},
  \n We received a request to reset the password on your Hemobelt Account. 
  \n ${resetCode} 
  \n Enter this code to complete the reset. 
  \n Thanks for helping us keep your account secure.
  \n Hemobelt Team`;
  try {
    await sendEmail({
      email: patient.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    patient.passwordResetCode = undefined;
    patient.passwordResetExpires = undefined;
    patient.passwordResetVerified = undefined;

    await patient.save();
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
}

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const patient = await Patient.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!patient) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  patient.passwordResetVerified = true;
  await patient.save();

  res.status(200).json({
    status: 'Success',
  });
}

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on email
  const patient = await Patient.findOne({ email: req.body.email });
  if (!patient) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!patient.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  patient.password = req.body.newPassword;
  patient.passwordResetCode = undefined;
  patient.passwordResetExpires = undefined;
  patient.passwordResetVerified = undefined;

  await patient.save();

  // 3) if everything is ok, generate token
  const token = createToken(patient._id);
  res.status(200).json({ token });
}

///////////////////////////////////////////////////////////////////////////////////


// @desc     Get current logged in patient
// @route    GET  api/v1/settings/me
// @access   Private

exports.getMe = async(req,res,next) =>{
  const patient = await Patient.findById(req.patient._id)

  res.status(200).json({
    success : true,
    data : patient
  })
}

