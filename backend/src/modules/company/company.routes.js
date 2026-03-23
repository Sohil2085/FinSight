import { Router } from "express";
import { getMyCompany, updateMyCompany, addMember, inviteMember } from "./company.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyCompany);
router.put("/me", authMiddleware, updateMyCompany);
router.post("/add-member", authMiddleware, addMember);
router.post("/invite-member", authMiddleware, inviteMember);

export default router;
