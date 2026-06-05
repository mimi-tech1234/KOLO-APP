CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  password_hash TEXT NOT NULL,
  business_type VARCHAR(80) NOT NULL,
  avatar_url TEXT,
  preferred_currency VARCHAR(5) NOT NULL DEFAULT 'NGN',
  pin_hash TEXT,
  biometric_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(60) NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  note TEXT,
  receipt_url TEXT,
  transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  photo_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount_due NUMERIC(14, 2) NOT NULL CHECK (amount_due >= 0),
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paid', 'overdue')),
  note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  sku VARCHAR(80),
  photo_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 3,
  unit_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region VARCHAR(40) NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  benchmark_price NUMERIC(14, 2) NOT NULL,
  currency VARCHAR(5) NOT NULL DEFAULT 'NGN',
  source VARCHAR(120),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_debts_user_status ON debts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_inventory_user_qty ON inventory_items(user_id, quantity);
