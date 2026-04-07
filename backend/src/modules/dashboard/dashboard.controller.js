import prisma from "../../config/db.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export const getInsights = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      invoices,
      expenses,
      currentMonthExp,
      prevMonthExp,
      currentMonthRevDoc,
      prevMonthRevDoc,
      groupedExpenses,
      paidInvoicesCount
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: { companyId },
        _sum: { balanceDue: true, amountPaid: true },
        _count: { id: true }
      }),
      prisma.expense.aggregate({
        where: { companyId },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: { companyId, date: { gte: currentMonthStart } },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: { companyId, date: { gte: prevMonthStart, lt: currentMonthStart } },
        _sum: { amount: true }
      }),
      prisma.invoice.aggregate({
        where: { companyId, invoiceDate: { gte: currentMonthStart } },
        _sum: { amountPaid: true }
      }),
      prisma.invoice.aggregate({
        where: { companyId, invoiceDate: { gte: prevMonthStart, lt: currentMonthStart } },
        _sum: { amountPaid: true }
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where: { companyId },
        _sum: { amount: true }
      }),
      prisma.invoice.count({
        where: { companyId, status: 'PAID' }
      })
    ]);

    groupedExpenses.sort((a, b) => (b._sum.amount || 0) - (a._sum.amount || 0));

    const outstandingAmount = invoices._sum.balanceDue || 0;
    const totalRevenue = invoices._sum.amountPaid || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const profit = totalRevenue - totalExpenses;
    
    const topExpenseCategory = groupedExpenses.length > 0 ? groupedExpenses[0].category : "None";
    
    const totalInvoices = invoices._count.id || 0;
    const paidInvoicePercentage = totalInvoices > 0 ? Math.round((paidInvoicesCount / totalInvoices) * 100) : 0;

    const currentExp = currentMonthExp._sum.amount || 0;
    const prevExp = prevMonthExp._sum.amount || 0;
    const currentRev = currentMonthRevDoc._sum.amountPaid || 0;
    const prevRev = prevMonthRevDoc._sum.amountPaid || 0;

    const monthlyExpenseTrend = prevExp > 0 ? Math.round(((currentExp - prevExp) / prevExp) * 100) : 0;
    const monthlyRevenueTrend = prevRev > 0 ? Math.round(((currentRev - prevRev) / prevRev) * 100) : 0;

    // AI Generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a senior financial advisor AI for a SaaS product called "FinSight".
Your job is to analyze business financial data and provide HIGH-QUALITY, REALISTIC, and TRUSTWORTHY insights.
You are NOT allowed to exaggerate, assume fake trends, or use hype language.
You must sound like a professional business consultant who gives honest, practical, and actionable advice.

INPUT DATA:
- Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
- Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
- Profit: ₹${profit.toLocaleString('en-IN')}
- Outstanding Amount: ₹${outstandingAmount.toLocaleString('en-IN')}
- Paid Invoice Percentage: ${paidInvoicePercentage}%
- Top Expense Category: ${topExpenseCategory}
- Monthly Revenue Trend: ${monthlyRevenueTrend}%
- Monthly Expense Trend: ${monthlyExpenseTrend}%

STRICT RULES:
1. DO NOT invent trends (e.g., "790% growth") unless explicitly supported by the trend data.
2. DO NOT use words like "explosive growth", "phenomenal performance", or "massive expansion".
3. If dataset is zero, small, or limited, explicitly mention that insights are based on a limited current snapshot and recommend consistently tracking data over time.
4. Every statement must be logically derived from the input data. Tone must be professional, human-like, slightly advisory, and grounded.
5. Each insight must include: what is happening, why it matters, and what the business should do next.

GENERATE 4-6 INSIGHTS COVERING:
1. CASH FLOW & OUTSTANDING PAYMENTS: If outstanding is > 0, explain impact on liquidity. Give actionable advice (e.g. reminders 2-3 days after due date, 7-14 day payment cycle, 1-2% early payment discounts).
2. PROFITABILITY ANALYSIS: Explain sustainability. If profit <= 0, warn clearly but calmly and suggest reducing non-essential expenses and reviewing pricing.
3. EXPENSE OPTIMIZATION: Review the top category (${topExpenseCategory}). Suggest vendor reviews, optimizing recurring expenses, and tracking unnecessary spending.
4. PAYMENT DISCIPLINE ANALYSIS: If paid invoice percentage < 70%, highlight risks to cash flow. Advise on follow-up schedules (3-day/7-day), stricter terms, or partial advance payments.

OUTPUT EXACTLY IN THIS JSON FORMAT:
{
  "insights": [
    {
      "title": "Cash Flow Management",
      "message": "Realistic, grounded, and highly actionable insight here..."
    }
  ],
  "summary": "5-6 line realistic business summary including current financial health, profit situation, key risks (like outstanding payments), stability of expenses, and clear practical next steps. Avoid exaggeration."
}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    
    let parsedInsights;
    try {
        parsedInsights = JSON.parse(text);
    } catch(e) {
        throw new Error("AI returned malformed insights data.");
    }

    successResponse(res, "Insights fetched successfully", parsedInsights);
  } catch (error) {
    console.error("Insights Error:", error);
    errorResponse(res, error.message || "Internal Server Error");
  }
};
