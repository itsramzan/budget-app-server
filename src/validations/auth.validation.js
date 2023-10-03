// Import essential modules
import { check } from "express-validator";
import handleValidation from "./handleValidation.js";

// Import essential models
import User from "../models/user.model.js";

// Register validation middleware
export const registerValidation = [
  check("username")
    .notEmpty()
    .withMessage("Username required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Username only contain english letter & space")
    .isLength({ min: 2 })
    .withMessage("Username can't be less than 2 character")
    .trim(),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Email address is not valid")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already in use");
        }
      } catch (err) {
        return Promise.reject(err.message);
      }
    })
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword()
    .withMessage("Password is not strong"),
  handleValidation("Registration credential validation error"),
];

// Verify email validation middleware
export const verifyEmailValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Email address is not valid")
    .trim(),
  check("otp")
    .notEmpty()
    .withMessage("OTP required")
    .isNumeric()
    .withMessage("OTP should be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP should be exactly 6 digits"),
  handleValidation("Verify email credential validation error"),
];

// Login validation middleware
export const loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Email address is not valid")
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword()
    .withMessage("Weak password"),
  handleValidation("Login credential validation error"),
];

// Reset password validation middleware
export const resetPasswordValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Email address is not valid")
    .trim(),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isStrongPassword()
    .withMessage("Weak password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password required")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Confirm password doesn't match with password");

      return true;
    }),
  check("otp")
    .exists()
    .withMessage("OTP required")
    .isNumeric()
    .withMessage("OTP should be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP should be exactly 6 digits"),
  handleValidation("Reset password credential validation error"),
];
