import { db } from "../config/db.js";

export const Inventory = {
  async create(data) {
    const { userId, name, sku, photoUrl, quantity = 0, reorderLevel = 3, unitPrice = 0 } = data;

    const { rows } = await db.query(
      `INSERT INTO inventory_items (user_id, name, sku, photo_url, quantity, reorder_level, unit_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, name, sku || null, photoUrl || null, quantity, reorderLevel, unitPrice]
    );
    return rows[0];
  },

  async findByUserId(userId) {
    const { rows } = await db.query(
      "SELECT * FROM inventory_items WHERE user_id = $1 ORDER BY name ASC",
      [userId]
    );
    return rows;
  },

  async findById(itemId, userId) {
    const { rows } = await db.query(
      "SELECT * FROM inventory_items WHERE id = $1 AND user_id = $2",
      [itemId, userId]
    );
    return rows[0] || null;
  },

  async update(itemId, userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    ["name", "sku", "photo_url", "quantity", "reorder_level", "unit_price"].forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(itemId, userId);

    fields.push(`updated_at = NOW()`);
    values.push(itemId);
    values.push(userId);

    const query = `UPDATE inventory_items SET ${fields.join(", ")} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`;
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async delete(itemId, userId) {
    const { rows } = await db.query(
      "DELETE FROM inventory_items WHERE id = $1 AND user_id = $2 RETURNING id",
      [itemId, userId]
    );
    return rows[0] || null;
  },

  async getLowStockItems(userId) {
    const { rows } = await db.query(
      `SELECT * FROM inventory_items 
       WHERE user_id = $1 AND quantity <= reorder_level
       ORDER BY quantity ASC`,
      [userId]
    );
    return rows;
  },

  async getInventorySummary(userId) {
    const { rows } = await db.query(
      `SELECT 
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        SUM(quantity * unit_price) as total_value,
        COUNT(CASE WHEN quantity <= reorder_level THEN 1 END) as low_stock_count
       FROM inventory_items
       WHERE user_id = $1`,
      [userId]
    );
    return rows[0];
  }
};
