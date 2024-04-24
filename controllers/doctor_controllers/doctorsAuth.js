const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../../utils/apiError");
const UserAuthorization = require("../../utils/UserAuthorization");
const sendEmail = require("../../utils/sendEmail");
const createToken = require("../../utils/createToken");

const Doctor = require("../../models/doctor_models/Doctor");

// @desc    Doctor Register
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create Doctor
  const doctor = await Doctor.create(req.body);

  doctor.password = undefined;

  // 2- Creat token
  const token = createToken(doctor._id);
  res.status(201).json({ data: doctor, token });
});

// @desc    Doctor Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ email: req.body.email });

  if (!doctor || !bcrypt.compareSync(req.body.password, doctor.password)) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(doctor._id);
  res.status(200).json({ data: doctor, token });
});

// @desc  make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  const decoded = userAuthorization.tokenVerifcation(token);
  const currentUser = await userAuthorization.checkCurrentUserExist(decoded);
  // userAuthorization.checkCurrentUserIsActive(currentUser);
  userAuthorization.checkUserChangeHisPasswordAfterTokenCreated(
    currentUser,
    decoded
  );

  req.user = currentUser;
  next();
});

//@desc  Authorization (user Permissions)
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this router", 403)
      );
    }
    next();
  });


// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get doctor by email
  const doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) {
    return next(
      new ApiError(`No doctor for this email : ${req.body.email}`, 404)
    );
  }
  // 2) If doctor exists, Generate hash rest random 4 digits.
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashedRestCode in db
  doctor.passwordResetCode = hashResetCode;
  doctor.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  doctor.passwordResetVerified = false;

  await doctor.save();

  const message = `Hi ${doctor.name},
   \n We received a request to reset the password on your medical Account .
    \n ${resetCode} \n Enter this code to complete the reset.
    \n Thanks for helping us keep your account secure.
     \n  the medical Team`;

  // 3-Send reset code via email
  try {
    await sendEmail({
      email: doctor.email,
      subject: "Your Password Reset Code (Valid For 10 min)",
      message,
    });
  } catch (err) {
    doctor.passwordResetCode = undefined;
    doctor.passwordResetExpires = undefined;
    doctor.passwordResetVerified = undefined;

    await doctor.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset Code send to email " });
});

// @desc    verify Password Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1- Get doctor based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode.toString())
    .digest("hex");

  const doctor = await Doctor.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!doctor) {
    return next(new ApiError("Reset Code invalid or expired", 422));
  }
  //2) resetcode valid
  doctor.passwordResetVerified = true;
  await doctor.save();

  res.status(200).json({
    status: "success",
  });
});

// @desc     Reset Password
// @route   PUT /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) {
    return next(
      new ApiError(`No doctor for this email : ${req.body.email}`, 404)
    );
  }
  if (!doctor.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  doctor.password = req.body.newPassword;
  doctor.passwordResetCode = undefined;
  doctor.passwordResetExpires = undefined;
  doctor.passwordResetVerified = undefined;

  await doctor.save();

  //3) if every thing is okay, generate token
  const token = createToken(doctor._id);
  res.status(200).json({ user,token });
});
