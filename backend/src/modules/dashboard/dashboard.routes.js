import { Router } from "express";
import { getDashboardSummary, getInsights } from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();
router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/insights", authMiddleware, getInsights);

export default router;
