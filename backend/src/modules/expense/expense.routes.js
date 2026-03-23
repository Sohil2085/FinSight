import { Router } from "express";
import { createExpense, getExpenses, getExpenseSummary } from "./expense.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.post("/", checkPermission('canAddExpense'), createExpense);
router.get("/", checkPermission('canViewExpense'), getExpenses);
router.get("/summary", checkPermission('canViewExpense'), getExpenseSummary);

export default router;
