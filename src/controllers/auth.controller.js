
const { globalError, ClientError } = require("shokhijakhon-error-handler");

const {
  registerValidator,
  verifyValidator,
  loginValidator,
  forgotPassOrResendOtpVal,
  resetPassValidator,
  changePasswordValidator,
} = require("../utils/validators/auth.validator");

const User = require("../models/user.model");

const { hash, compare } = require("bcrypt");

const emailService = require("../lib/mail.service");
const generateOTP6 = require("../utils/generators/otp.generator");
const jwtService = require("../lib/jwt.service");

module.exports = {

  async REGISTER(req, res) {
    try {
      let newUser = req.body;

      await registerValidator.validateAsync(newUser);

      const checkUser = await User.findOne({
        where: { email: newUser.email }
      });

      if (checkUser) {
        throw new ClientError("User already exist with this email", 400);
      }

      newUser.password = await hash(newUser.password, 10);

      let { otp, otpTime } = generateOTP6();

      await emailService(newUser.email, otp);

      await User.create({
        ...newUser,
        otp,
        otpTime
      });

      return res.json({
        message: "Verification code sent to your email",
        status: 200,
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async RESEND_OTP(req, res) {
    try {
      let data = req.body;

      await forgotPassOrResendOtpVal.validateAsync(data);

      let user = await User.findOne({
        where: { email: data.email }
      });

      if (!user) throw new ClientError("User not found", 404);

      if (user.is_verified)
        throw new ClientError("User already verified", 400);

      let { otp, otpTime } = generateOTP6();

      await emailService(user.email, otp);

      await User.update(
        { otp, otpTime },
        { where: { email: user.email } }
      );

      return res.json({
        message: "Verification code resent to your email",
        status: 200,
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async VERIFY(req, res) {
    try {
      let data = req.body;

      await verifyValidator.validateAsync(data);

      let user = await User.findOne({
        where: { email: data.email }
      });

      if (!user) throw new ClientError("User not found", 404);

      if (user.is_verified)
        throw new ClientError("User already verified", 400);

      if (user.otp != data.otp)
        throw new ClientError("OTP is incorrect", 400);

      const currentDate = Date.now();

      if (user.otpTime < currentDate)
        throw new ClientError("OTP expired", 400);

      await User.update(
        {
          is_verified: true,
          otp: null,
        },
        {
          where: { email: data.email }
        }
      );

      return res.json({
        message: "Email successfully verified",
        status: 200,
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async LOGIN(req, res) {
    try {
      let data = req.body;

      await loginValidator.validateAsync(data);

      let findUser = await User.findOne({
        where: { email: data.email }
      });

      if (!findUser)
        throw new ClientError("Email or password is incorrect", 400);

      if (!findUser.is_verified)
        throw new ClientError("Please verify your email first", 403);

      let checkPassword = await compare(data.password, findUser.password);

      if (!checkPassword)
        throw new ClientError("Email or password is incorrect", 400);

      let accessToken = jwtService.createAccessToken({
        sub: findUser.id,
        role: findUser.role,
      });

      const refreshToken = jwtService.createRefreshToken({
        sub: findUser.id,
        role: findUser.role,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 90 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "User succesfully logged in",
        status: 200,
        accessToken,
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async FORGOT_PASSWORD(req, res) {
    try {
      let data = req.body;

      await forgotPassOrResendOtpVal.validateAsync(data);

      let user = await User.findOne({
        where: { email: data.email }
      });

      if (!user)
        throw new ClientError("User not found", 404);

      if (!user.is_verified)
        throw new ClientError("Please verify your email first", 400);

      const { otp, otpTime } = generateOTP6();

      await emailService(user.email, otp);

      await User.update(
        {
          otp,
          otpTime
        },
        {
          where: { email: user.email }
        }
      );

      return res.json({
        message: "Password reset code sent to your email",
        status: 200,
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async RESET_PASSWORD(req, res) {
    try {
      let data = req.body;

      await resetPassValidator.validateAsync(data);

      let user = await User.findOne({
        where: { email: data.email }
      });

      if (!user)
        throw new ClientError("User not found", 404);

      if (!user.is_verified)
        throw new ClientError("Please verify your email first", 400);

      let currentDate = Date.now();

      if (user.otp != data.otp)
        throw new ClientError("OTP is incorrect", 400);

      if (currentDate > user.otpTime)
        throw new ClientError("OTP expired");

      let new_password = await hash(data.new_password, 10);

      await User.update(
        {
          password: new_password,
          otp: null,
          otpTime: null,
        },
        {
          where: { email: data.email }
        }
      );

      return res.json({
        message: "Password successfully updated",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async CHANGE_PASSWORD(req, res) {
    try {
      let data = req.body;

      await changePasswordValidator.validateAsync(data);

      let user = await User.findByPk(req.user.sub);

      if (!user)
        throw new ClientError("User not found", 404);

      if (!user.is_verified)
        throw new ClientError("Please verify your email first", 403);

      const checkPassword = await compare(
        data.oldPassword,
        user.password
      );

      if (!checkPassword)
        throw new ClientError("Old password is incorrect");

      if (data.newPassword == data.oldPassword)
        throw new ClientError("Password must be different", 400);

      const hashed = await hash(data.newPassword, 10);

      await User.update(
        { password: hashed },
        { where: { id: user.id } }
      );

      return res.json({
        message: "Password updated",
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  },


  async REFRESH(req, res) {
    try {
      let refreshToken = req.cookies.refresh_token;

      if (!refreshToken)
        throw new ClientError("Token not found", 404);

      const payload = jwtService.parseRefreshToken(refreshToken);

      const accessToken = jwtService.createAccessToken({
        sub: payload.sub,
        role: payload.role
      });

      return res.json({
        message: "Access token generated",
        accessToken,
        status: 200
      });

    } catch (err) {
      return globalError(err, res);
    }
  }

};

