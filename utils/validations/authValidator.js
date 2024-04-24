const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Patient = require('../../models/Patient');

exports.signupValidator = [
  check('username')
    .notEmpty()
    .withMessage('Username required')
    .isLength({ min: 3 })
    .withMessage('Too short username'),
    
      
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      Patient.findOne({ email: val }).then((patient) => {
        if (patient) {
          return Promise.reject(new Error('E-mail is already registered'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  validatorMiddleware,

  check('age')
  .notEmpty()
  .withMessage('Age required')
  .isNumeric()
  .withMessage('Age must be a positive number'),
  

  check('gender')
  .notEmpty()
  .withMessage('gender required')
  .isIn(['female', 'male'])
  .withMessage('Gender is invalid'),

  check('barcode')
  .notEmpty()
  .withMessage('barcode required')
  .isLength({ max: 12 })
  .withMessage('You skipped the maximum number'),
]

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validatorMiddleware,
];
