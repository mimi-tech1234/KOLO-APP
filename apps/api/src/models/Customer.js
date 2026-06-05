import { db } from "../config/db.js";

export const Customer = {
  async create(data) {
    const { userId, fullName, phone, photoUrl } = data;

    const { rows } = await db.query(
      `INSERT INTO customers (user_id, full_name, phone, photo_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, fullName, phone || null, photoUrl || null]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await db.query(
      "SELECT * FROM customers WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  async findById(customerId, userId) {
    const { rows } = await db.query(
      "SELECT * FROM customers WHERE id = $1 AND user_id = $2",
      [customerId, userId]
    );
    return rows[0] || null;
  },

  async update(customerId, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    ["full_name", "phone", "photo_url"].forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(customerId, userId);

    fields.push(`updated_at = NOW()`);
    values.push(customerId);
    values.push(userId);

    const query = `UPDATE customers SET ${fields.join(", ")} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async delete(customerId, userId) {
    const { rows } = await db.query(
      "DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id",
      [customerId, userId]
    );
    return rows[0] || null;
  },

  async getCustomerStats(userId) {
    const { rows } = await db.query(
      `SELECT COUNT(*) as total_customers FROM customers WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  }
};
