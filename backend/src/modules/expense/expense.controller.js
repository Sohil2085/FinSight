import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create Expense
export const createExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;
        const companyId = req.user.companyId;
        const userId = req.user.userId; // Correct user object reference based on common practice, double check jwt structure if issues

        if (!amount || !category || !date) {
            return res.status(400).json({ error: "Amount, category, and date are required" });
        }

        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                description,
                date: new Date(date),
                companyId,
                createdBy: userId
            }
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error("Create Expense Error:", error);
        res.status(500).json({ error: "Failed to create expense" });
    }
};

// Get all expenses for a company
export const getExpenses = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { search } = req.query;

        const whereClause = { companyId };

        if (search) {
            whereClause.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: { date: 'desc' }
        });

        res.json(expenses);
    } catch (error) {
        console.error("Get Expenses Error:", error);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};

// Get Expense Summary (Totals and specific categories)
export const getExpenseSummary = async (req, res) => {
    try {
        const companyId = req.user.companyId;

        // Optionally, filter by current month/year. The requirement says "Total Expenses" and shows some month initially (Feb), but we'll fetch across total for now or we could filter by date.
        // Let's get total for company
        const expenses = await prisma.expense.findMany({
            where: { companyId }
        });

        let totalExpenses = 0;
        let operations = 0;
        let marketing = 0;
        let software = 0;

        expenses.forEach(exp => {
            totalExpenses += exp.amount;
            if (exp.category === 'Operations' || exp.category === 'operations') operations += exp.amount;
            if (exp.category === 'Marketing' || exp.category === 'marketing') marketing += exp.amount;
            if (exp.category === 'Software' || exp.category === 'software') software += exp.amount;
        });

        res.json({
            totalExpenses,
            operations,
            marketing,
            software
        });

    } catch (error) {
        console.error("Expense Summary Error:", error);
        res.status(500).json({ error: "Failed to fetch expense summary" });
    }
};
