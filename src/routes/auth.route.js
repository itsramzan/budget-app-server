// Import essential modules
import { Router } from "express";
import * as authValidation from "../validations/auth.validation.js";
import * as authController from "../controllers/auth.controller.js";

// Initialize router
const router = Router();

//! Register
router.post(
  "/register",
  authValidation.registerValidation,
  authController.register
);

//! Verify email
router.post(
  "/verify-email",
  authValidation.verifyEmailValidation,
  authController.verifyEmail
);

//! Login
router.post("/login", authValidation.loginValidation, authController.login);

//! Send otp
router.post("/send-otp", authController.sendOTP);

//! Reset password (forget password)
router.post(
  "/reset-password",
  authValidation.resetPasswordValidation,
  authController.resetPassword
);

//! Refresh token
router.post("/refresh-token", authController.refreshToken);

// Export router
export default router;
