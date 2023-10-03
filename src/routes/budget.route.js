// Import essential modules
import { Router } from "express";
import checkAuth from "../middlewares/common/checkAuth.js";
import handleQuery from "../middlewares/common/handleQuery.js";
import * as budgetValidation from "../validations/budget.validation.js";
import * as budgetController from "../controllers/budget.controller.js";

// Initialize router
const router = Router();

// Use checkAuth middleware
router.use(checkAuth);

//! Create budget
router.post(
  "/",
  budgetValidation.createBudgetValidation,
  budgetController.createBudget
);

//! Get all budgets
router.get("/", handleQuery, budgetController.getAllBudgets);

//! Get budget by id
router.get("/:id", budgetController.getBudgetById);

//! Update budget
router.put(
  "/:id",
  budgetValidation.updateBudgetValidation,
  budgetController.updateBudget
);

//! Update user avatar
router.delete("/:id", budgetController.deleteBudget);

// Export router
export default router;
