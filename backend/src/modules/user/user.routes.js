import { Router } from "express";
import { getMe } from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMe);

export default router;
