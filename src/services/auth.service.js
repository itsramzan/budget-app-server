// Import essential modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import otpGenerator from "../utils/otpGenerator.js";
import { otpSender } from "../utils/mailer.js";

// Import essential models
import User from "../models/user.model.js";

//! Register handler
export const registerHandler = async (data) => {
  // Hashed password
  const hashedPassword = await bcrypt.hash(
    data.password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS)
  );

  // Generate final data
  const otp = otpGenerator();
  const otpExpireIn = new Date(Date.now() + 600000); //! Expires in 10 minutes
  const finalData = { ...data, password: hashedPassword, otp, otpExpireIn };

  // Save user on db
  const newUser = new User(finalData);
  const user = await newUser.save();

  // Send verification mail
  const res = await otpSender(user.email, {
    username: user.username,
    otp: user.otp,
    otpExpireIn: user.otpExpireIn,
  });

  if (!res) throw createError(202, "OTP sending failed");
};

//! Verify email
export const verifyEmailHandler = async (email, otp) => {
  // Find user
  const user = await User.findOne({ email });

  // If user doesn't found
  if (!user) throw createError(404, "No account found to verify");

  // If OTP attempts exceeded
  if (user.otpAttempts >= 5)
    throw createError(403, "Maximum OTP attempts exceeded");

  // If OTP time expire
  if (user.otpExpireIn < Date.now()) throw createError(400, "OTP Expired");

  // If OTP doesn't match
  if (user.otp !== otp) {
    user.otpAttempts++; // increase the OTP attempts
    await user.save(); // save the updated user
    throw createError(400, "Wrong OTP");
  }

  // Update user
  user.isVerified = true;
  user.otp = null;
  user.otpExpireIn = null;
  user.otpAttempts = 0;
  await user.save();
};

//! Login handler
export const loginHandler = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });

  // If user doesn't found
  if (!user) throw createError(404, "No account found");

  // Compare password
  const comparePassword = await bcrypt.compare(password, user.password);

  // If password doesn't match
  if (!comparePassword) throw createError(401, "Authentication failed");

  // If user isn't verified
  if (!user.isVerified) throw createError(403, "Verify your account first");

  // Generate payload & tokens
  const payload = {
    _id: user?._id,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  return { payload, accessToken, refreshToken };
};

//! Send OTP handler
export const sendOTPHandler = async (email) => {
  // Find user
  const user = await User.findOne({ email });

  // If user doesn't found
  if (!user) throw createError(404, "No account found");

  // Generate final data
  const otp = otpGenerator();
  const otpExpireIn = new Date(Date.now() + 600000); //! Expires in 10 minutes

  // Update user
  user.otp = otp;
  user.otpExpireIn = otpExpireIn;
  user.otpAttempts = 0;
  await user.save();

  // Send verification mail
  const res = await otpSender(user.email, {
    username: user.username,
    otp: user.otp,
    otpExpireIn: user.otpExpireIn,
  });

  if (!res) throw createError(500, "OTP sending failed");
};

//! Reset password handler
export const resetPasswordHandler = async (data) => {
  const { email, password, otp } = data;

  // Find user
  const user = await User.findOne({ email });

  // If user doesn't found
  if (!user) throw createError(404, "No account found");

  // If OTP attempts exceeded
  if (user.otpAttempts >= 5)
    throw createError(403, "Maximum OTP attempts exceeded");

  // If OTP time expire
  if (user.otpExpireIn < Date.now()) throw createError(400, "OTP Expired");

  // If OTP doesn't match
  if (user.otp !== otp) {
    user.otpAttempts++; // increase the OTP attempts
    await user.save(); // save the updated user
    throw createError(400, "Wrong OTP");
  }

  // Update user
  user.password = await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS)
  );
  user.otp = null;
  user.otpExpireIn = null;
  user.otpAttempts = 0;
  await user.save();
};

//! Refresh token handler
export const refreshTokenHandler = async (cookieRefreshToken) => {
  // If cookie refresh token is not exists
  if (!cookieRefreshToken) throw createError(401, "Authentication failed");

  // Decode cookie refresh token
  const decode = jwt.verify(cookieRefreshToken, process.env.JWT_SECRET);

  // Generate payload & tokens
  const payload = { _id: decode?._id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  return { payload, accessToken, refreshToken };
};
