import { Router } from "express";

import authRoutes from "./auth/auth.routes.js";
import companyRoutes from "./company/company.routes.js";
import userRoutes from "./user/user.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/users", userRoutes);
router.use("/invoices", invoiceRoutes);

export default router;
