import { Router } from "express";
import { register, login, acceptInvite } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/accept-invite", acceptInvite);

export default router;
