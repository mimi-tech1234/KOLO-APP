import { Customer } from "../models/Customer.js";
import { Debt } from "../models/Debt.js";
import { notificationService } from "../services/notificationService.js";

export async function createCustomer(req, res) {
  try {
    const { fullName, phone, photoUrl } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const customer = await Customer.create({
      userId: req.user.userId,
      fullName,
      phone,
      photoUrl
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: "Could not create customer", error: error.message });
  }
}

export async function updateCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const customer = await Customer.update(customerId, req.user.userId, req.body);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Failed to update customer", error: error.message });
  }
}

export async function listCustomers(req, res) {
  try {
    const customers = await Customer.findByUserId(req.user.userId);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers", error: error.message });
  }
}

export async function getCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId, req.user.userId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch customer's debts
    const debts = await Debt.findByCustomerId(customerId, req.user.userId);
    res.json({ ...customer, debts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customer", error: error.message });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const deleted = await Customer.delete(customerId, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted", customerId });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete customer", error: error.message });
  }
}

export async function createDebt(req, res) {
  try {
    const { customerId, amountDue, dueDate, note } = req.body;

    if (!customerId || !amountDue) {
      return res.status(400).json({ message: "customerId and amountDue are required" });
    }

    const status = dueDate && new Date(dueDate) < new Date() ? "overdue" : "open";

    const debt = await Debt.create({
      userId: req.user.userId,
      customerId,
      amountDue: parseFloat(amountDue),
      dueDate,
      status,
      note
    });

    res.status(201).json(debt);
  } catch (error) {
    res.status(400).json({ message: "Could not create debt", error: error.message });
  }
}

export async function updateDebt(req, res) {
  try {
    const { debtId } = req.params;
    const debt = await Debt.update(debtId, req.user.userId, req.body);

    if (!debt) {
      return res.status(404).json({ message: "Debt not found" });
    }

    res.json(debt);
  } catch (error) {
    res.status(500).json({ message: "Failed to update debt", error: error.message });
  }
}

export async function listDebts(req, res) {
  try {
    const { status } = req.query;
    const debts = await Debt.findByUserId(req.user.userId, status);
    res.json(debts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch debts", error: error.message });
  }
}

export async function getDebtSummary(req, res) {
  try {
    const summary = await Debt.getDebtSummary(req.user.userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch debt summary", error: error.message });
  }
}

export async function getOverdueDebts(req, res) {
  try {
    const overdueDebts = await Debt.getOverdueDebts(req.user.userId);
    res.json(overdueDebts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch overdue debts", error: error.message });
  }
}

export async function sendDebtReminder(req, res) {
  try {
    const { debtId } = req.params;
    const result = await notificationService.sendDebtReminder(debtId, req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to send reminder", error: error.message });
  }
}

export async function listCustomersWithDebts(req, res) {
  try {
    const customers = await Customer.findByUserId(req.user.userId);
    
    const customerDebts = await Promise.all(
      customers.map(async (customer) => {
        const debts = await Debt.findByCustomerId(customer.id, req.user.userId);
        const totalDebt = debts
          .filter((d) => d.status !== "paid")
          .reduce((sum, d) => sum + parseFloat(d.amount_due || 0), 0);

        return {
          ...customer,
          total_debt: totalDebt,
          debt_count: debts.length,
          debts
        };
      })
    );

    res.json(customerDebts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers with debts", error: error.message });
  }
}
