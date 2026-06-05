import { Transaction } from "../models/Transaction.js";
import { reportService } from "../services/reportService.js";
import { pricingService } from "../services/pricingService.js";

export async function createTransaction(req, res) {
  try {
    const { type, category, amount, note, receiptUrl, transactionDate } = req.body;

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'income' or 'expense'" });
    }
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const transaction = await Transaction.create({
      userId: req.user.userId,
      type,
      category,
      amount: parseFloat(amount),
      note,
      receiptUrl,
      transactionDate
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Could not create transaction.", error: error.message });
  }
}

export async function listTransactions(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await Transaction.findByUserId(req.user.userId, limit, offset);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
}

export async function updateTransaction(req, res) {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.update(transactionId, req.user.userId, req.body);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to update transaction", error: error.message });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { transactionId } = req.params;
    const deleted = await Transaction.delete(transactionId, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted", transactionId });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error: error.message });
  }
}

export async function dashboardSummary(req, res) {
  try {
    const summary = await reportService.generateDashboardSummary(req.user.userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary", error: error.message });
  }
}

export async function getTransactionTrend(req, res) {
  try {
    const months = Math.min(parseInt(req.query.months) || 6, 24);
    const trends = await reportService.generateMonthlyTrend(req.user.userId, months);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trends", error: error.message });
  }
}

export async function marketPrices(req, res) {
  try {
    const { region, category } = req.query;

    if (!region) {
      return res.status(400).json({ message: "Region parameter is required" });
    }

    const prices = await pricingService.getMarketPrices(region, category);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch prices", error: error.message });
  }
}

export async function calculateMargin(req, res) {
  try {
    const { itemName, sellingPrice, region } = req.body;

    if (!itemName || !sellingPrice || !region) {
      return res.status(400).json({ message: "itemName, sellingPrice, and region are required" });
    }

    const result = await pricingService.calculateProfitMargin(
      itemName,
      parseFloat(sellingPrice),
      region
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate margin", error: error.message });
  }
}

export async function getMarketRegions(req, res) {
  try {
    const regions = await pricingService.getAllRegions();
    res.json({ regions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch regions", error: error.message });
  }
}
    profit: Number(income.rows[0].total) - Number(expense.rows[0].total)
  });
}

export async function marketPrices(req, res) {
  const region = req.query.region || "Lagos";
  const { rows } = await db.query(
    "SELECT * FROM price_benchmarks WHERE region = $1 ORDER BY category",
    [region]
  );
  res.json(rows);
}
