const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("./validatorMiddleware");
const phonenumberformate = require("./PhoneNumberFormate");
const Doctor = require("../../../models/doctor_models/Doctor");

exports.signupValidator = [
  check("name")
    .custom((name, { req }) => (req.body.slug = slugify(name)))
    .notEmpty()
    .withMessage("Doctor name Required")
    .isLength({ min: 3 })
    .withMessage("Too short Doctor name"),

  check("email")
    .notEmpty()
    .withMessage("email Required")
    .isEmail()
    .withMessage("invalid email address")
    .toLowerCase()
    .custom((val) =>
      Doctor.findOne({ email: val }).then((email) => {
        if (email) {
          throw new Error("E-mail already exists");
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password Required")
    .isLength({ min: 8 })
    .withMessage("Too short password"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword required")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        throw new Error("passwordConfirmation not match password");
      }
      return true;
    }),
  check("ID").notEmpty().withMessage("ID required"),
  check("phone")
    .isMobilePhone(phonenumberformate())
    .withMessage("Invalid phone number"),
  check("location").notEmpty().withMessage("Your Location required"),
  check("experience")
    .notEmpty()
    .withMessage("Your experience required")
    .isNumeric()
    .withMessage("Your experience must be a number"),

  check("profileImg").optional(),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email reauired")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Too short password"),
  validatorMiddleware,
];
exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Reauired")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  validatorMiddleware,
];

exports.verifyPassResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code required")
    .isLength({ min: 4 })
    .withMessage("reset code must be 4 numbers")
    .isLength({ max: 4 })
    .withMessage("reset code must be 4 numbers"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Reauired")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("newPassword")
    .notEmpty()
    .withMessage("new Password required")
    .isLength({ min: 8 })
    .withMessage("Too short password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword required")
    .custom((val, { req }) => {
      if (val != req.body.newPassword) {
        throw new Error("passwordConfirmation not match password");
      }
      return true;
    }),
  validatorMiddleware,
];
