// Import essential modules
import * as budgetService from "../services/budget.service.js";

//! Create budget
export const createBudget = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const data = { ...req.body, creator: userId };

    const result = await budgetService.createBudgetHandler(data);

    res.status(201).json({
      status: "success",
      data: { message: "Budget successfully created", result },
    });
  } catch (err) {
    next(err);
  }
};

//! Get all budgets
export const getAllBudgets = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const query = { pagination: req.pagination, sorting: req.sorting };

    const { search, type } = req.query;

    const filtering = {};
    if (search) filtering.title = { $regex: search, $options: "i" };
    if (type) filtering.type = { $regex: new RegExp(`^${type}$`, "i") };

    query.filtering = filtering;

    const result = await budgetService.getAllBudgetsHandler(userId, query);

    res.status(200).json({
      status: "success",
      data: { message: "Get all budgets", result },
    });
  } catch (err) {
    next(err);
  }
};

//! Get budget by id
export const getBudgetById = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const budgetId = req.params.id;

    const result = await budgetService.getBudgetByIdHandler(userId, budgetId);

    res.status(200).json({
      status: "success",
      data: { message: "Get budget by id", result },
    });
  } catch (err) {
    next(err);
  }
};

//! Update budget
export const updateBudget = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const budgetId = req.params.id;
    const { creator, ...rest } = req.body;
    const data = rest;

    const result = await budgetService.updateTodoHandler(
      userId,
      budgetId,
      data
    );

    res.status(200).json({
      status: "success",
      data: {
        message: "Budget update successful",
        result,
      },
    });
  } catch (err) {
    next(err);
  }
};

//! Delete budget
export const deleteBudget = async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const budgetId = req.params.id;

    const result = await budgetService.deleteBudgetHandler(userId, budgetId);

    res.status(200).json({
      status: "success",
      data: { message: "Budget successfully deleted", result },
    });
  } catch (err) {
    next(err);
  }
};
