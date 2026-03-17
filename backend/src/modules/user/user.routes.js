import { Router } from "express";
import { getMe, updateUser } from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateUser);

export default router;
