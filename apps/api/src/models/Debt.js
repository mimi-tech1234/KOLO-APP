import { db } from "../config/db.js";

export const Debt = {
  async create(data) {
    const { userId, customerId, amountDue, dueDate, status = "open", note } = data;

    const { rows } = await db.query(
      `INSERT INTO debts (user_id, customer_id, amount_due, due_date, status, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, customerId, amountDue, dueDate || null, status, note || null]
    );
    return rows[0];
  },

  async findByUserId(userId, statusFilter = null) {
    let query = "SELECT * FROM debts WHERE user_id = $1";
    const values = [userId];

    if (statusFilter) {
      query += " AND status = $2";
      values.push(statusFilter);
    }

    query += " ORDER BY created_at DESC";
    const { rows } = await db.query(query, values);
    return rows;
  },

  async findByCustomerId(customerId, userId) {
    const { rows } = await db.query(
      "SELECT * FROM debts WHERE customer_id = $1 AND user_id = $2 ORDER BY created_at DESC",
      [customerId, userId]
    );
    return rows;
  },

  async findById(debtId, userId) {
    const { rows } = await db.query(
      "SELECT * FROM debts WHERE id = $1 AND user_id = $2",
      [debtId, userId]
    );
    return rows[0] || null;
  },

  async update(debtId, userId, data) {
    const { amountDue, dueDate, status, note } = data;

    const { rows } = await db.query(
      `UPDATE debts SET amount_due = $1, due_date = $2, status = $3, note = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [amountDue, dueDate || null, status, note || null, debtId, userId]
    );
    return rows[0];
  },

  async markAsPaid(debtId, userId) {
    return this.update(debtId, userId, { status: "paid" });
  },

  async markAsOverdue(debtId, userId) {
    return this.update(debtId, userId, { status: "overdue" });
  },

  async getDebtSummary(userId) {
    const { rows } = await db.query(
      `SELECT 
        COUNT(*) as total_debts,
        SUM(CASE WHEN status = 'open' THEN amount_due ELSE 0 END) as open_amount,
        SUM(CASE WHEN status = 'overdue' THEN amount_due ELSE 0 END) as overdue_amount,
        SUM(CASE WHEN status = 'paid' THEN amount_due ELSE 0 END) as paid_amount
       FROM debts
       WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  },

  async getOverdueDebts(userId) {
    const { rows } = await db.query(
      `SELECT d.*, c.full_name as customer_name, c.phone FROM debts d
       JOIN customers c ON d.customer_id = c.id
       WHERE d.user_id = $1 AND d.status = 'overdue'
       ORDER BY d.due_date ASC`,
      [userId]
    );
    return rows;
  }
};
