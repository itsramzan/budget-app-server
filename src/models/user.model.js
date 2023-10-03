// Import essential modules
import { Schema, Types, model } from "mongoose";

// Initiate userSchema
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    mobile: { type: String, default: null },
    avatar: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpireIn: Date,
    otpAttempts: { type: Number, default: 0 },
    budgets: [{ type: Types.ObjectId, ref: "budget" }],
  },
  { timestamps: true }
);

// Initiate User model
const User = model("user", userSchema);

// Export User model
export default User;
