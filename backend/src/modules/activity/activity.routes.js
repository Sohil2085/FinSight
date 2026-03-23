import { Router } from "express";
import { getActivityLogs } from "./activity.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();
router.get("/", authMiddleware, getActivityLogs);

export default router;
