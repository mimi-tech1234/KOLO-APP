import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(root, "apps/api/.env") });
dotenv.config({ path: path.join(root, "apps/api/.env.local") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL. Add it to apps/api/.env then run again.");
  console.error("Example (Supabase): postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres?sslmode=require");
  process.exit(1);
}

const useSsl =
  process.env.NODE_ENV === "production" ||
  DATABASE_URL.includes("supabase") ||
  DATABASE_URL.includes("sslmode=require");

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

async function runFile(filename) {
  const filePath = path.join(__dirname, filename);
  const sql = fs.readFileSync(filePath, "utf8");
  await pool.query(sql);
  console.log(`Applied ${filename}`);
}

async function main() {
  console.log("Kolo App — creating database tables...\n");
  await runFile("schema.sql");
  await runFile("seed.sql");
  console.log("\nDone. Tables: users, transactions, customers, debts, inventory_items, price_benchmarks, push_tokens");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
