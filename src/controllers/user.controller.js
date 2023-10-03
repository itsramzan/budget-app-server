// Import essential modules
import * as userService from "../services/user.service.js";

//! Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const result = await userService.getUserByIdHandler(userId);

    res
      .status(200)
      .json({ status: "success", data: { message: "Get profile", result } });
  } catch (err) {
    next(err);
  }
};

//! Update user details
export const updateDetails = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { username, dateOfBirth, gender, address, mobile } = req.body;
    const data = { username, dateOfBirth, gender, address, mobile };

    const result = await userService.updateDetailsHandler(userId, data);

    res.status(200).json({
      status: "success",
      data: {
        message: "Details update successful",
        result,
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Change user password
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { currentPassword, newPassword } = req.body;
    const data = { currentPassword, newPassword };

    await userService.changePasswordHandler(userId, data);

    res.status(200).json({
      status: "success",
      data: {
        message: "Change password successful",
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Update user avatar
export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const data = req?.file?.path;

    const result = await userService.updateAvatarHandler(userId, data);

    res.status(200).json({
      status: "success",
      data: { message: "Avatar upload successfull", result },
    });
  } catch (err) {
    next(err);
  }
};
