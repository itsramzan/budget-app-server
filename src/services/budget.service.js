// Import essential modules
import createError from "http-errors";
import mongoose from "mongoose";

// Import essential models
import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";

//! Create budget handler
export const createBudgetHandler = async (data) => {
  const newBudget = await Budget(data);
  const budget = await newBudget.save();

  await User.updateOne(
    { _id: data.creator },
    { $push: { budgets: budget._id } }
  );

  return budget;
};

//! Get all budgets handler
export const getAllBudgetsHandler = async (userId, query) => {
  const user = await User.findById(userId).select("budgets");

  if (!user) throw createError(404, "User not found");

  const { filtering, pagination, sorting } = query;

  const { budgets } = await user.populate({
    path: "budgets",
    match: { ...filtering },
    options: {
      sort: Object.fromEntries(sorting),
    },
  });

  const stat = budgets.reduce(
    (totals, budget) => {
      if (budget.type === "income") {
        totals.totalIncome += budget.amount;
      } else if (budget.type === "expense") {
        totals.totalExpense += budget.amount;
      }
      totals.totalSaving = totals.totalIncome - totals.totalExpense;
      return totals;
    },
    { totalIncome: 0, totalExpense: 0, totalSaving: 0 }
  );

  const paginatedBudgets = budgets.slice(
    pagination.skip,
    pagination.skip + pagination.limit
  );

  const totalBudgets = budgets.length;
  const pages = Math.ceil(totalBudgets / pagination.limit);

  const meta = {
    page: pagination.page,
    skip: pagination.skip,
    limit: pagination.limit,
    total: totalBudgets,
    pages,
  };

  return {
    budgets: paginatedBudgets,
    stat,
    meta,
  };
};

//! Get budget by id handler
export const getBudgetByIdHandler = async (userId, budgetId) => {
  const budget = await Budget.findOne({ _id: budgetId, creator: userId });

  if (!budget) throw createError(404, "Budget not found");

  return budget;
};

//! Update todo handler
export const updateTodoHandler = async (userId, budgetId, data) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: budgetId, creator: userId },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!budget) throw createError(404, "No budget found for update");

  return budget;
};

//! Delete budget handler
export const deleteBudgetHandler = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({
    _id: budgetId,
    creator: userId,
  });

  if (!budget) throw createError(404, "No budget found for delete");

  await User.updateOne({ _id: userId }, { $pull: { todos: budget._id } });

  return budget;
};
