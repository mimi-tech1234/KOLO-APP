import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "kolo-dev-secret-change-in-production";

function signToken(user) {
  return jwt.sign(
    { userId: user.id, phone: user.phone, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const { fullName, email, phone, password, businessType, preferredCurrency } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const identifier = email || phone;
    const existing = await db.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1 LIMIT 1",
      [identifier]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Account already exists. Please log in instead." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (full_name, email, phone, password_hash, business_type, preferred_currency)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, email, phone, business_type, preferred_currency
    `;

    const { rows } = await db.query(query, [
      fullName,
      email || null,
      phone || null,
      passwordHash,
      businessType,
      preferredCurrency || "NGN"
    ]);

    res.status(201).json({
      user: {
        id: rows[0].id,
        fullName: rows[0].full_name,
        email: rows[0].email,
        phone: rows[0].phone,
        businessType: rows[0].business_type,
        preferredCurrency: rows[0].preferred_currency
      },
      token: signToken(rows[0])
    });
  } catch (error) {
    res.status(400).json({ message: "Registration failed.", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier?.trim() || !password) {
      return res.status(400).json({ message: "Email/phone and password are required." });
    }

    const { rows } = await db.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1 LIMIT 1",
      [identifier]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials." });

    res.json({
      token: signToken(user),
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        email: user.email,
        businessType: user.business_type,
        preferredCurrency: user.preferred_currency
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
}
