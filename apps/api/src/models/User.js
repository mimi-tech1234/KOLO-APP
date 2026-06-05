import { db } from "../config/db.js";

export const User = {
  async findById(id) {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const { rows } = await db.query("SELECT * FROM users WHERE phone = $1", [phone]);
    return rows[0] || null;
  },

  async findByIdentifier(identifier) {
    const { rows } = await db.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [identifier]
    );
    return rows[0] || null;
  },

  async create(data) {
    const {
      fullName,
      email,
      phone,
      passwordHash,
      businessType,
      preferredCurrency = "NGN"
    } = data;

    const { rows } = await db.query(
      `INSERT INTO users (full_name, email, phone, password_hash, business_type, preferred_currency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [fullName, email || null, phone || null, passwordHash, businessType, preferredCurrency]
    );
    return rows[0];
  },

  async updateBiometric(userId, pinHash, biometricEnabled) {
    const { rows } = await db.query(
      `UPDATE users SET pin_hash = $1, biometric_enabled = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [pinHash, biometricEnabled, userId]
    );
    return rows[0];
  },

  async updateProfile(userId, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    });

    if (fields.length === 0) return this.findById(userId);

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    const { rows } = await db.query(query, values);
    return rows[0];
  }
};
