import { PrismaClient } from "@prisma/client";
import { calculateInvoice } from "../../utils/invoiceCalculator.js";

const prisma = new PrismaClient();

export const createInvoice = async (companyId, data) => {
    // Extract GST-specific structural fields, leaving rest for standard mapping
    const { items, gstType, discount, ...invoiceData } = data;

    // Utilize precise calculator ensuring fallback mechanism is active
    const calculations = calculateInvoice(items, gstType, discount);

    // Generate Invoice Number if not provided
    if (!invoiceData.invoiceNumber) {
        invoiceData.invoiceNumber = `INV-${Date.now()}`;
    }

    return await prisma.invoice.create({
        data: {
            ...invoiceData,
            
            // Legacy / Standard Field Bridge
            subtotal: calculations.subTotal,
            totalAmount: calculations.grandTotal, 

            // Newly Mapped Safe Defaults
            discount: calculations.discount,
            cgstTotal: calculations.cgstTotal,
            sgstTotal: calculations.sgstTotal,
            igstTotal: calculations.igstTotal,
            roundOff: calculations.roundOff,
            amountPaid: 0,
            balanceDue: calculations.grandTotal,

            companyId,
            items: {
                create: calculations.processedItems.map(item => ({
                    description: item.description,
                    quantity: Number(item.quantity) || 0,
                    unitPrice: Number(item.unitPrice) || 0,
                    total: item.total,
                    discount: item.discount,
                    gstRate: item.gstRate,
                    gstAmount: item.gstAmount
                }))
            }
        },
        include: {
            items: true,
            payments: true
        }
    });
};

export const getInvoices = async (companyId, filters = {}) => {
    const { search } = filters;
    const where = {
        companyId,
        ...(search && {
            OR: [
                { customerName: { contains: search, mode: 'insensitive' } },
                { invoiceNumber: { contains: search, mode: 'insensitive' } }
            ]
        })
    };

    return await prisma.invoice.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { 
            items: true,
            payments: true 
        }
    });
};

export const getInvoiceSummary = async (companyId) => {
    const invoices = await prisma.invoice.findMany({
        where: { companyId },
        select: { totalAmount: true, status: true, amountPaid: true, balanceDue: true }
    });

    let totalInvoiced = 0;
    let paidAmount = 0;
    let pendingAmount = 0;

    for (const inv of invoices) {
        totalInvoiced += inv.totalAmount;
        
        if (inv.status === 'PAID') {
            paidAmount += inv.totalAmount; // Trust PAID status over potentially 0 tracked amount for legacy
        } else if (inv.status === 'PARTIALLY_PAID') {
            paidAmount += inv.amountPaid || 0;
            pendingAmount += inv.balanceDue != null ? inv.balanceDue : inv.totalAmount;
        } else {
            pendingAmount += inv.balanceDue != null && inv.balanceDue > 0 ? inv.balanceDue : inv.totalAmount;
        }
    }

    return { totalInvoiced, paidAmount, pendingAmount };
};

export const updateInvoiceStatus = async (companyId, invoiceId, status) => {
    return await prisma.invoice.update({
        where: {
            id: invoiceId,
            companyId // Ensure ownership
        },
        data: { status }
    });
};

export const addPayment = async (companyId, invoiceId, data) => {
    return await prisma.$transaction(async (tx) => {
        const invoice = await tx.invoice.findFirst({
            where: { id: invoiceId, companyId }
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        const amount = Number(data.amount) || 0;
        if (amount <= 0) {
            throw new Error("Payment amount must be greater than zero");
        }

        // Avoid overpayment logic (optional stringency, but safe)
        const newAmountPaid = invoice.amountPaid + amount;
        const billTotal = invoice.totalAmount;
        let newBalanceDue = billTotal - newAmountPaid;

        if (newBalanceDue < 0) {
            newBalanceDue = 0; // Cap at 0 to avoid negative due, though user could theoretically overpay
        }

        let newStatus = invoice.status;
        if (newAmountPaid >= billTotal && billTotal > 0) {
            newStatus = 'PAID';
        } else if (newAmountPaid > 0) {
            newStatus = 'PARTIALLY_PAID';
        }

        // Create the individual payment history record
        const payment = await tx.payment.create({
            data: {
                amount,
                method: data.method || 'OTHER',
                referenceId: data.referenceId,
                notes: data.notes,
                invoiceId: invoice.id
            }
        });

        // Mirror the update on the parent aggregate record
        await tx.invoice.update({
            where: { id: invoice.id },
            data: {
                amountPaid: newAmountPaid,
                balanceDue: newBalanceDue,
                status: newStatus
            }
        });

        return payment;
    }, {
        maxWait: 15000, // 15 seconds max wait to connect (solves Neon DB cold start)
        timeout: 30000  // 30 seconds max execution time
    });
};
