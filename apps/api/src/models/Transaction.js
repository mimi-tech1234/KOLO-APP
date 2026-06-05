import { db } from "../config/db.js";

export const Transaction = {
  async create(data) {
    const { userId, type, category, amount, note, receiptUrl, transactionDate } = data;

    const { rows } = await db.query(
      `INSERT INTO transactions (user_id, type, category, amount, note, receipt_url, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, type, category, amount, note || null, receiptUrl || null, transactionDate || new Date()]
    );
    return rows[0];
  },

  async findByUserId(userId, limit = 50, offset = 0) {
    const { rows } = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async getSummary(userId, startDate, endDate) {
    const { rows } = await db.query(
      `SELECT 
        type,
        SUM(amount) as total
       FROM transactions 
       WHERE user_id = $1 AND transaction_date BETWEEN $2 AND $3
       GROUP BY type`,
      [userId, startDate, endDate]
    );
    return rows;
  },

  async getCategoryBreakdown(userId, type, startDate, endDate) {
    const { rows } = await db.query(
      `SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
       FROM transactions 
       WHERE user_id = $1 AND type = $2 AND transaction_date BETWEEN $3 AND $4
       GROUP BY category
       ORDER BY total DESC`,
      [userId, type, startDate, endDate]
    );
    return rows;
  },

  async findById(transactionId, userId) {
    const { rows } = await db.query(
      "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
      [transactionId, userId]
    );
    return rows[0] || null;
  },

  async update(transactionId, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (["type", "category", "amount", "note", "receipt_url"].includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(transactionId, userId);

    fields.push(`updated_at = NOW()`);
    values.push(transactionId);
    values.push(userId);

    const query = `UPDATE transactions SET ${fields.join(", ")} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async delete(transactionId, userId) {
    const { rows } = await db.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id",
      [transactionId, userId]
    );
    return rows[0] || null;
  }
};
