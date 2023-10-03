// Import essential modules
import OTP from "otp-generator";

// OTP Generator
const otpGenerator = () =>
  OTP.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

// Export OTP Generator
export default otpGenerator;
