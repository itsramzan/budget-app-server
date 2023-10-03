// Import essential modules
import { check } from "express-validator";
import handleValidation from "./handleValidation.js";

// Details validation middleware
export const detailsValidation = [
  check("username")
    .optional()
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Username only contain english letter & space")
    .isLength({ min: 2, max: 15 })
    .withMessage("Username must be mininum 2 & maximum 15 character")
    .trim(),
  check("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Not a valid gender type")
    .trim(),
  check("address")
    .optional()
    .isLength({ max: 150 })
    .withMessage("Address can't be longer than 150 character")
    .trim(),
  check("mobile")
    .optional()
    .isMobilePhone("bn-BD")
    .withMessage("Not a valid mobile number")
    .trim(),
  handleValidation("Details credential validation error"),
];

// Change password validation middleware
export const changePasswordValidation = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password required")
    .isStrongPassword()
    .withMessage("Current password is not strong"),
  check("newPassword")
    .notEmpty()
    .withMessage("New password required")
    .isStrongPassword()
    .withMessage("New password is not strong"),
  handleValidation("Change password credential validation error"),
];
