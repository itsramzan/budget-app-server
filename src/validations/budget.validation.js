// Import essential modules
import { check } from "express-validator";
import handleValidation from "./handleValidation.js";

// Create budget validation middleware
export const createBudgetValidation = [
  check("title").notEmpty().withMessage("Budget title can't be empty").trim(),
  check("type").isIn(["income", "expense"]).withMessage("Invalid budget type"),
  check("amount").isNumeric().withMessage("Budget amount must be valid number"),
  handleValidation("Create budget credentials validation error"),
];

// Update budget validation middleware
export const updateBudgetValidation = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("Budget title can't be empty")
    .trim(),
  check("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Invalid budget type"),
  check("amount")
    .optional()
    .isNumeric()
    .withMessage("Budget amount must be valid number"),
  handleValidation("Update budget credentials validation error"),
];
