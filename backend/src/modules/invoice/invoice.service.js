import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInvoice = async (companyId, data) => {
    const { items, ...invoiceData } = data;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal; // Add tax logic here later if needed

    // Generate Invoice Number if not provided
    if (!invoiceData.invoiceNumber) {
        invoiceData.invoiceNumber = `INV-${Date.now()}`;
    }

    return await prisma.invoice.create({
        data: {
            ...invoiceData,
            subtotal,
            totalAmount,
            companyId,
            items: {
                create: items.map(item => ({
                    ...item,
                    total: item.quantity * item.unitPrice
                }))
            }
        },
        include: {
            items: true
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
        include: { items: true }
    });
};

export const getInvoiceSummary = async (companyId) => {
    const summary = await prisma.invoice.groupBy({
        by: ['status'],
        where: { companyId },
        _sum: {
            totalAmount: true
        }
    });

    const totalInvoiced = await prisma.invoice.aggregate({
        where: { companyId },
        _sum: { totalAmount: true }
    });

    const paidAmount = summary.find(s => s.status === 'PAID')?._sum.totalAmount || 0;
    const pendingAmount = summary.find(s => s.status !== 'PAID')?._sum.totalAmount || 0;

    return {
        totalInvoiced: totalInvoiced._sum.totalAmount || 0,
        paidAmount,
        pendingAmount
    };
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
