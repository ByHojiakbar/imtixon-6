const Joi = require("joi");

// REGISTER
const registerValidator = Joi.object({
  firstname: Joi.string().trim().min(3).required().messages({
    "string.base": "Firstname must be a string",
    "string.empty": "Firstname must not be empty",
    "string.min": "Firstname must be at least 3 characters",
    "any.required": "Firstname is required",
  }),

  lastname: Joi.string().trim().min(3).required().messages({
    "string.base": "Lastname must be a string",
    "string.empty": "Lastname must not be empty",
    "string.min": "Lastname must be at least 3 characters",
    "any.required": "Lastname is required",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().trim().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// LOGIN
const loginValidator = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().trim().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password must not be empty",
    "any.required": "Password is required",
  }),
});

// VERIFY OTP
const verifyValidator = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  otp: Joi.string().trim().length(6).required().messages({
    "string.base": "OTP must be a string",
    "string.empty": "OTP must not be empty",
    "string.length": "OTP must be 6 digits",
    "any.required": "OTP is required",
  }),
});

// FORGOT / RESEND OTP
const forgotPassOrResendOtpVal = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email must not be empty",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

// RESET PASSWORD
const resetPassValidator = Joi.object({
  email: Joi.string().trim().email().required(),

  otp: Joi.string().trim().length(6).required(),

  new_password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),
});

// CHANGE PASSWORD
const changePasswordValidator = Joi.object({
  oldPassword: Joi.string().trim().required(),

  newPassword: Joi.string().trim().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
  }),
});

module.exports = {
  registerValidator,
  loginValidator,
  verifyValidator,
  forgotPassOrResendOtpVal,
  resetPassValidator,
  changePasswordValidator,
};

