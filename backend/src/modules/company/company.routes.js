import { Router } from "express";
import { getMyCompany } from "./company.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyCompany);

export default router;
