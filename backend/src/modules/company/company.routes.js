import { Router } from "express";
import { getMyCompany, updateMyCompany } from "./company.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyCompany);
router.put("/me", authMiddleware, updateMyCompany);

export default router;
