// Import essential modules
import bcrypt from "bcrypt";
import createError from "http-errors";

// Import essential models
import User from "../models/user.model.js";

//! Get user by id handler
export const getUserByIdHandler = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -otp -otpExpireIn -otpAttempts -todos"
  );

  if (!user) throw createError(404, "User not found");

  return user;
};

//! Update user details handler
export const updateDetailsHandler = async (userId, data) => {
  const result = await User.findOneAndUpdate(
    { _id: userId },
    { $set: data },
    { new: true, runValidators: true }
  ).select(Object.keys(data).join(" "));

  if (!result) throw createError(400, "Details update failed");

  return result;
};

//! Change user password handler
export const changePasswordHandler = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  // Find user
  const user = await User.findById(userId);

  // If user doesn't exist
  if (!user) throw createError(404, "User not found");

  // If user exist
  const comparePassword = await bcrypt.compare(currentPassword, user.password);

  // If currentPassword comparison became false
  if (!comparePassword)
    throw createError(403, "Current password doesn't matched");

  // If currentPassword comparison became true
  const hashedPassword = await bcrypt.hash(
    newPassword,
    parseInt(process.env.BCRYPT_SALT_ROUNDS)
  );

  await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
};

//! Update avatar/profile handler
export const updateAvatarHandler = async (userId, data) => {
  console.log(data);
  if (!data) throw createError(400, "Avatar update failed");

  const result = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { avatar: data } },
    { new: true, runValidators: true }
  ).select("avatar");

  return result;
};
