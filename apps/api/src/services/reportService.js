import { Transaction } from "../models/Transaction.js";
import { Debt } from "../models/Debt.js";
import { Inventory } from "../models/Inventory.js";

export const reportService = {
  async generateDashboardSummary(userId) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const [transactions, debtStats, inventoryStats] = await Promise.all([
        Transaction.getSummary(userId, startOfMonth, endOfMonth),
        Debt.getDebtSummary(userId),
        Inventory.getInventorySummary(userId)
      ]);

      // Process transaction data
      const monthlyIncome = transactions.find((t) => t.type === "income")?.total || 0;
      const monthlyExpense = transactions.find((t) => t.type === "expense")?.total || 0;
      const profit = monthlyIncome - monthlyExpense;

      // Get weekly transactions
      const weeklyTransactions = await Transaction.getSummary(
        userId,
        startOfWeek,
        endOfMonth
      );
      const weeklyIncome = weeklyTransactions.find((t) => t.type === "income")?.total || 0;
      const weeklyExpense = weeklyTransactions.find((t) => t.type === "expense")?.total || 0;

      return {
        period: { month: today.getMonth() + 1, year: today.getFullYear() },
        monthly: {
          income: parseFloat(monthlyIncome || 0),
          expense: parseFloat(monthlyExpense || 0),
          profit: parseFloat(profit || 0)
        },
        weekly: {
          income: parseFloat(weeklyIncome || 0),
          expense: parseFloat(weeklyExpense || 0)
        },
        debts: {
          totalDebts: parseInt(debtStats?.total_debts || 0),
          openAmount: parseFloat(debtStats?.open_amount || 0),
          overdueAmount: parseFloat(debtStats?.overdue_amount || 0)
        },
        inventory: {
          totalItems: parseInt(inventoryStats?.total_items || 0),
          totalQuantity: parseInt(inventoryStats?.total_quantity || 0),
          totalValue: parseFloat(inventoryStats?.total_value || 0),
          lowStockCount: parseInt(inventoryStats?.low_stock_count || 0)
        }
      };
    } catch (error) {
      console.error("Error generating dashboard summary:", error);
      throw error;
    }
  },

  async generateDetailedReport(userId, startDate, endDate) {
    try {
      const transactions = await Transaction.findByUserId(userId, 1000, 0);
      const filtered = transactions.filter((t) => {
        const tDate = new Date(t.transaction_date);
        return tDate >= startDate && tDate <= endDate;
      });

      const income = filtered.filter((t) => t.type === "income");
      const expenses = filtered.filter((t) => t.type === "expense");

      const incomeTotal = income.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const expenseTotal = expenses.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      const categoryBreakdown = {};
      filtered.forEach((t) => {
        if (!categoryBreakdown[t.category]) {
          categoryBreakdown[t.category] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
          categoryBreakdown[t.category].income += parseFloat(t.amount || 0);
        } else {
          categoryBreakdown[t.category].expense += parseFloat(t.amount || 0);
        }
      });

      return {
        period: { startDate, endDate },
        totals: {
          income: incomeTotal,
          expense: expenseTotal,
          profit: incomeTotal - expenseTotal
        },
        transactionCount: filtered.length,
        categories: categoryBreakdown,
        transactions: filtered
      };
    } catch (error) {
      console.error("Error generating detailed report:", error);
      throw error;
    }
  },

  async generateMonthlyTrend(userId, months = 6) {
    try {
      const trends = [];
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const summary = await Transaction.getSummary(userId, startOfMonth, endOfMonth);
        const income = summary.find((t) => t.type === "income")?.total || 0;
        const expense = summary.find((t) => t.type === "expense")?.total || 0;

        trends.push({
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          income: parseFloat(income || 0),
          expense: parseFloat(expense || 0),
          profit: parseFloat((income || 0) - (expense || 0))
        });
      }

      return trends;
    } catch (error) {
      console.error("Error generating monthly trend:", error);
      throw error;
    }
  }
};

export function buildSimpleHtmlReport({ businessName, summary }) {
  return `
    <html>
      <body style="font-family: Arial; padding: 24px;">
        <h1 style="color:#1B1F5E;">Kolo Financial Summary</h1>
        <h3>${businessName}</h3>
        <p>Income: <strong>${summary.income}</strong></p>
        <p>Expense: <strong>${summary.expense}</strong></p>
        <p>Profit: <strong>${summary.profit}</strong></p>
      </body>
    </html>
  `;
}
