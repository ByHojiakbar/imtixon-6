javascript
const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const authGuard = require("../guards/auth.guard");

const authRouter = Router();

authRouter.post("/register", authController.REGISTER);

authRouter.post("/verify/otp", authController.VERIFY);

authRouter.post("/login", authController.LOGIN);

authRouter.post("/resend/otp", authController.RESEND_OTP);

authRouter.post("/forgot/password", authController.FORGOT_PASSWORD);

authRouter.post("/reset/password", authController.RESET_PASSWORD);

authRouter.post(
  "/change/password",
  authGuard,
  authController.CHANGE_PASSWORD
);

authRouter.post("/refresh", authController.REFRESH);

module.exports = authRouter;

