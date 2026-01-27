import { Router } from "express";
import * as invoiceController from "./invoice.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/summary", invoiceController.getInvoiceSummary);
router.patch("/:id/status", invoiceController.updateInvoiceStatus);

export default router;
