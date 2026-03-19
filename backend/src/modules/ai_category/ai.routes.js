import express from "express";
import { categorizeExpense } from "./ai.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/categorize", authMiddleware, categorizeExpense);

export default router;