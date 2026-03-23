import prisma from "../../config/db.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const getDashboardSummary = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return errorResponse(res, "Access Denied: Admins only", 403);
    }
    const companyId = req.user.companyId;

    const [invoices, expenses] = await Promise.all([
      prisma.invoice.aggregate({
        where: { companyId },
        _sum: { totalAmount: true }
      }),
      prisma.expense.aggregate({
        where: { companyId },
        _sum: { amount: true }
      })
    ]);

    const totalRevenue = invoices._sum.totalAmount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const profit = totalRevenue - totalExpenses;

    const summary = {
      totalRevenue,
      totalExpenses,
      profit
    };

    successResponse(res, "Dashboard summary fetched", summary);
  } catch (error) {
    errorResponse(res, error.message);
  }
};
