import { Router } from "express";

import authRoutes from "./auth/auth.routes.js";
import companyRoutes from "./company/company.routes.js";
import userRoutes from "./user/user.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";
import expenseRoutes from "./expense/expense.routes.js";    
import aiRoutes from "./ai_category/ai.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/users", userRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/expenses", expenseRoutes); 
router.use("/ai", aiRoutes);

export default router;
