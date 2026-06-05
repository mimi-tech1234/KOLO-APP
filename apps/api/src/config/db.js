import pg from "pg";
import dotenv from "dotenv";
import { memoryQuery } from "../store/memoryStore.js";

dotenv.config();

const useMock = process.env.USE_MOCK === "true" || !process.env.DATABASE_URL;

const { Pool } = pg;

const pool = useMock
  ? null
  : new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });

export const db = {
  query: (text, params) => {
    if (useMock) return Promise.resolve(memoryQuery(text, params));
    return pool.query(text, params);
  }
};

if (useMock) {
  console.log("Kolo API running in memory mode (USE_MOCK). No PostgreSQL required.");
}
