import { Router } from "express";
import { createExpense, getExpenses, getExpenseSummary } from "./expense.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/summary", getExpenseSummary);

export default router;
