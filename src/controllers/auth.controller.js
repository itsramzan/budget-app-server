// Import essential modules
import * as authService from "../services/auth.service.js";
import cookieOptions from "../configs/cookie.config.js";

//! Register
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const data = { username, email, password };

    await authService.registerHandler(data);

    res.status(201).json({
      status: "success",
      data: { message: "Verification mail sent" },
    });
  } catch (err) {
    next(err);
  }
};

//! Verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    await authService.verifyEmailHandler(email, otp);

    res.status(200).json({
      status: "success",
      data: {
        message: "Verification successful",
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginHandler(email, password);

    const { refreshToken } = result;

    res.cookie("jwt", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      data: {
        message: "Authentication successful",
        result,
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Send OTP
export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.sendOTPHandler(email);

    res.status(200).json({
      status: "success",
      data: {
        message: "OTP send successful",
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, otp } = req.body;

    const data = { email, password, confirmPassword, otp };

    await authService.resetPasswordHandler(data);

    res.status(200).json({
      status: "success",
      data: {
        message: "Password reset successful",
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Refresh token
export const refreshToken = async (req, res, next) => {
  try {
    const cookieRefreshToken = req.cookies?.jwt;

    const result = await authService.refreshTokenHandler(cookieRefreshToken);

    const { refreshToken } = result;

    res.cookie("jwt", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      data: {
        message: "Token refresh successful",
        result,
      },
    });
  } catch (err) {
    next(err);
  }
};
