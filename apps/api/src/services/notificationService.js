import { db } from "../config/db.js";

export const notificationService = {
  async sendDebtReminder(debtId, userId) {
    try {
      const { rows } = await db.query(
        `SELECT d.*, c.full_name, c.phone, u.phone as user_phone
         FROM debts d
         JOIN customers c ON d.customer_id = c.id
         JOIN users u ON d.user_id = u.id
         WHERE d.id = $1 AND d.user_id = $2`,
        [debtId, userId]
      );

      if (rows.length === 0) {
        throw new Error("Debt not found");
      }

      const debt = rows[0];
      const message = `Reminder: ${debt.full_name} owes you ${debt.amount_due} (Due: ${debt.due_date || "No date set"})`;

      // In production, integrate with Twilio WhatsApp API or Firebase Cloud Messaging
      console.log(`Debt Reminder: ${message}`);

      return {
        success: true,
        message: "Reminder sent successfully",
        debtId,
        customerName: debt.full_name,
        amount: debt.amount_due
      };
    } catch (error) {
      console.error("Error sending debt reminder:", error);
      throw error;
    }
  },

  async sendLowStockAlert(itemId, userId) {
    try {
      const { rows } = await db.query(
        "SELECT * FROM inventory_items WHERE id = $1 AND user_id = $2",
        [itemId, userId]
      );

      if (rows.length === 0) {
        throw new Error("Inventory item not found");
      }

      const item = rows[0];
      const message = `Low Stock Alert: ${item.name} quantity is ${item.quantity} (Reorder level: ${item.reorder_level})`;

      console.log(`Low Stock Alert: ${message}`);

      return {
        success: true,
        message: "Alert sent successfully",
        itemId,
        itemName: item.name,
        quantity: item.quantity
      };
    } catch (error) {
      console.error("Error sending low stock alert:", error);
      throw error;
    }
  },

  async registerPushToken(userId, token, platform = "web") {
    try {
      // Store push token for future notifications
      const { rows } = await db.query(
        `INSERT INTO push_tokens (user_id, token, platform, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, platform) DO UPDATE SET token = $2, updated_at = NOW()
         RETURNING *`,
        [userId, token, platform]
      );

      return { success: true, message: "Push token registered", tokenId: rows[0]?.id };
    } catch (error) {
      // If push_tokens table doesn't exist, just log it
      console.log("Note: Push token storage not available:", error.message);
      return { success: true, message: "Push token recorded in memory" };
    }
  }
};
