import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
  dashboardSummary,
  getTransactionTrend,
  marketPrices,
  calculateMargin,
  getMarketRegions
} from "../controllers/financeController.js";
import {
  createCustomer,
  updateCustomer,
  listCustomers,
  getCustomer,
  deleteCustomer,
  createDebt,
  updateDebt,
  listDebts,
  getDebtSummary,
  getOverdueDebts,
  sendDebtReminder,
  listCustomersWithDebts
} from "../controllers/crmController.js";
import {
  createInventoryItem,
  updateInventoryItem,
  listInventory,
  getInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  getInventorySummary,
  updateQuantity
} from "../controllers/inventoryController.js";
import { registerPushToken, registerBiometric } from "../controllers/deviceController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ============= AUTH ROUTES =============
router.post("/auth/register", register);
router.post("/auth/login", login);

// ============= DASHBOARD & REPORTS =============
router.get("/dashboard/summary", requireAuth, dashboardSummary);
router.get("/dashboard/trends", requireAuth, getTransactionTrend);

// ============= TRANSACTION ROUTES =============
router.post("/transactions", requireAuth, createTransaction);
router.get("/transactions", requireAuth, listTransactions);
router.put("/transactions/:transactionId", requireAuth, updateTransaction);
router.delete("/transactions/:transactionId", requireAuth, deleteTransaction);

// ============= CUSTOMER & DEBT ROUTES =============
router.post("/customers", requireAuth, createCustomer);
router.get("/customers", requireAuth, listCustomers);
router.get("/customers/with-debts", requireAuth, listCustomersWithDebts);
router.get("/customers/:customerId", requireAuth, getCustomer);
router.put("/customers/:customerId", requireAuth, updateCustomer);
router.delete("/customers/:customerId", requireAuth, deleteCustomer);

router.post("/debts", requireAuth, createDebt);
router.get("/debts", requireAuth, listDebts);
router.get("/debts/summary", requireAuth, getDebtSummary);
router.get("/debts/overdue", requireAuth, getOverdueDebts);
router.put("/debts/:debtId", requireAuth, updateDebt);
router.post("/debts/:debtId/reminder", requireAuth, sendDebtReminder);

// ============= INVENTORY ROUTES =============
router.post("/inventory", requireAuth, createInventoryItem);
router.get("/inventory", requireAuth, listInventory);
router.get("/inventory/summary", requireAuth, getInventorySummary);
router.get("/inventory/low-stock", requireAuth, getLowStockItems);
router.get("/inventory/:itemId", requireAuth, getInventoryItem);
router.put("/inventory/:itemId", requireAuth, updateInventoryItem);
router.put("/inventory/:itemId/quantity", requireAuth, updateQuantity);
router.delete("/inventory/:itemId", requireAuth, deleteInventoryItem);

// ============= MARKET PRICING & INSIGHTS =============
router.get("/market/prices", requireAuth, marketPrices);
router.get("/market/regions", requireAuth, getMarketRegions);
router.post("/market/calculate-margin", requireAuth, calculateMargin);

// ============= DEVICE ROUTES =============
router.post("/devices/push-token", requireAuth, registerPushToken);
router.post("/devices/biometric", requireAuth, registerBiometric);

export default router;
