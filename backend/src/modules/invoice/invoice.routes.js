import { Router } from "express";
import * as invoiceController from "./invoice.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", checkPermission('canCreateInvoice'), invoiceController.createInvoice);
router.get("/", checkPermission('canViewInvoice'), invoiceController.getInvoices);
router.get("/summary", checkPermission('canViewInvoice'), invoiceController.getInvoiceSummary);
router.patch("/:id/status", checkPermission('canCreateInvoice'), invoiceController.updateInvoiceStatus);
router.post("/:id/payments", checkPermission('canCreateInvoice'), invoiceController.addPayment);
router.post("/:id/send", checkPermission('canCreateInvoice'), invoiceController.sendInvoice);

export default router;
