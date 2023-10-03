// Import essential modules
import { Schema, Types, model } from "mongoose";

// Initiate budgetSchema
const budgetSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
    amount: { type: Number, required: true },
    creator: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

// Initiate Budget model
const Budget = model("budget", budgetSchema);

// Export Budget model
export default Budget;
