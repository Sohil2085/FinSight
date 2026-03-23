import * as invoiceService from "./invoice.service.js";
import { logActivity } from "../activity/activity.service.js";

export const createInvoice = async (req, res) => {
    try {
        const invoice = await invoiceService.createInvoice(req.user.companyId, req.body);
        await logActivity(req.user.userId, req.user.companyId, "CREATE", "INVOICE", invoice.id);
        res.status(201).json(invoice);
    } catch (error) {
        console.error("Create Invoice Error:", error);
        res.status(500).json({ error: "Failed to create invoice" });
    }
};

export const getInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getInvoices(req.user.companyId, req.query);
        res.json(invoices);
    } catch (error) {
        console.error("Get Invoices Error:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
};

export const getInvoiceSummary = async (req, res) => {
    try {
        const summary = await invoiceService.getInvoiceSummary(req.user.companyId);
        res.json(summary);
    } catch (error) {
        console.error("Invoice Summary Error:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
};

export const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedInvoice = await invoiceService.updateInvoiceStatus(req.user.companyId, id, status);
        await logActivity(req.user.userId, req.user.companyId, "UPDATE", "INVOICE", updatedInvoice.id);
        res.json(updatedInvoice);
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};
