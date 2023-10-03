// Import essential modules
import { Router } from "express";
import checkAuth from "../middlewares/common/checkAuth.js";
import * as userValidation from "../validations/user.validation.js";
import { avatarUpload } from "../middlewares/common/upload.js";
import * as userController from "../controllers/user.controller.js";

// Initialize router
const router = Router();

// Use checkAuth middleware
router.use(checkAuth);

//! Get user profile
router.get("/profile", userController.getProfile);

//! Update user details
router.put(
  "/update-details",
  userValidation.detailsValidation,
  userController.updateDetails
);

//! Change user password
router.put(
  "/change-password",
  userValidation.changePasswordValidation,
  userController.changePassword
);

//! Update user avatar
router.put(
  "/update-avatar",
  avatarUpload.single("avatar"),
  userController.updateAvatar
);

// Export router
export default router;
