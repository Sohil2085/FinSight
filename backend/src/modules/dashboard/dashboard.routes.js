import { Router } from "express";
import { getDashboardSummary } from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();
router.get("/summary", authMiddleware, getDashboardSummary);

export default router;
