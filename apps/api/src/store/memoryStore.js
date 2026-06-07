import { randomUUID } from "crypto";

const store = {
  users: [],
  transactions: [],
  customers: [],
  debts: [],
  inventory_items: [],
  price_benchmarks: [
    {
      id: randomUUID(),
      region: "Lagos",
      item_name: "Ankara Dress Sewing",
      category: "Tailoring",
      benchmark_price: "18000",
      currency: "NGN"
    },
    {
      id: randomUUID(),
      region: "Lagos",
      item_name: "Leather Shoes Repair",
      category: "Cobbler",
      benchmark_price: "5000",
      currency: "NGN"
    },
    {
      id: randomUUID(),
      region: "Accra",
      item_name: "Hair Braiding (Medium)",
      category: "Hair",
      benchmark_price: "220",
      currency: "GHS"
    }
  ]
};

function seedDemoData(userId) {
  if (store.transactions.some((t) => t.user_id === userId)) return;

  store.transactions.push(
    {
      id: randomUUID(),
      user_id: userId,
      type: "income",
      category: "Sales",
      amount: "320000",
      transaction_date: new Date().toISOString()
    },
    {
      id: randomUUID(),
      user_id: userId,
      type: "expense",
      category: "Materials",
      amount: "61600",
      transaction_date: new Date().toISOString()
    }
  );

  const customerId = randomUUID();
  store.customers.push({
    id: customerId,
    user_id: userId,
    full_name: "Ama Mensah",
    phone: "2335550102",
    created_at: new Date().toISOString()
  });
  store.customers.push({
    id: randomUUID(),
    user_id: userId,
    full_name: "Chinedu Obi",
    phone: "23480200100",
    created_at: new Date().toISOString()
  });

  store.debts.push({
    id: randomUUID(),
    user_id: userId,
    customer_id: customerId,
    amount_due: "480",
    status: "overdue"
  });

  store.inventory_items.push(
    {
      id: randomUUID(),
      user_id: userId,
      name: "Ankara Fabric Rolls",
      quantity: 2,
      reorder_level: 5,
      unit_price: "45000",
      created_at: new Date().toISOString()
    },
    {
      id: randomUUID(),
      user_id: userId,
      name: "Thread Spools",
      quantity: 18,
      reorder_level: 6,
      unit_price: "1200",
      created_at: new Date().toISOString()
    }
  );
}

function customerDebtTotal(customerId) {
  return store.debts
    .filter((d) => d.customer_id === customerId && d.status !== "paid")
    .reduce((sum, d) => sum + Number(d.amount_due), 0);
}

function transactionsInRange(userId, start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return store.transactions.filter((t) => {
    if (t.user_id !== userId) return false;
    const date = new Date(t.transaction_date);
    return date >= startDate && date <= endDate;
  });
}

export function memoryQuery(text, params = []) {
  const sql = text.replace(/\s+/g, " ").trim();

  if (sql.includes("INSERT INTO users")) {
    const user = {
      id: randomUUID(),
      full_name: params[0],
      email: params[1],
      phone: params[2],
      password_hash: params[3],
      business_type: params[4],
      preferred_currency: params[5]
    };
    store.users.push(user);
    seedDemoData(user.id);
    return {
      rows: [
        {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          business_type: user.business_type,
          preferred_currency: user.preferred_currency
        }
      ]
    };
  }

  if (sql.includes("FROM users WHERE email")) {
    const identifier = params[0];
    const user = store.users.find((u) => u.email === identifier || u.phone === identifier);
    return { rows: user ? [user] : [] };
  }

  if (sql.includes("INSERT INTO transactions")) {
    const row = {
      id: randomUUID(),
      user_id: params[0],
      type: params[1],
      category: params[2],
      amount: String(params[3]),
      note: params[4],
      receipt_url: params[5],
      transaction_date: params[6]
    };
    store.transactions.push(row);
    return { rows: [row] };
  }

  if (sql.includes("FROM transactions") && sql.includes("GROUP BY type")) {
    const userId = params[0];
    const ranged = transactionsInRange(userId, params[1], params[2]);
    const totals = { income: 0, expense: 0 };
    ranged.forEach((t) => {
      totals[t.type] = (totals[t.type] || 0) + Number(t.amount);
    });
    const rows = Object.entries(totals)
      .filter(([, total]) => total > 0)
      .map(([type, total]) => ({ type, total: String(total) }));
    return { rows };
  }

  if (sql.includes("FROM transactions WHERE user_id")) {
    const limit = params[1] ? Number(params[1]) : undefined;
    const offset = params[2] ? Number(params[2]) : 0;
    let rows = store.transactions
      .filter((t) => t.user_id === params[0])
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    if (limit) rows = rows.slice(offset, offset + limit);
    return { rows };
  }

  if (sql.includes("type = 'income'")) {
    const total = store.transactions
      .filter((t) => t.user_id === params[0] && t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { rows: [{ total: String(total) }] };
  }

  if (sql.includes("type = 'expense'")) {
    const total = store.transactions
      .filter((t) => t.user_id === params[0] && t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { rows: [{ total: String(total) }] };
  }

  if (sql.includes("DISTINCT region FROM price_benchmarks")) {
    const regions = [...new Set(store.price_benchmarks.map((p) => p.region))].sort();
    return { rows: regions.map((region) => ({ region })) };
  }

  if (sql.includes("item_name ILIKE")) {
    const pattern = String(params[0]).replace(/%/g, "").toLowerCase();
    const row = store.price_benchmarks.find(
      (p) => p.region === params[1] && p.item_name.toLowerCase().includes(pattern)
    );
    return { rows: row ? [{ benchmark_price: row.benchmark_price }] : [] };
  }

  if (sql.includes("FROM price_benchmarks")) {
    let rows = store.price_benchmarks.filter((p) => p.region === params[0]);
    if (params[1]) rows = rows.filter((p) => p.currency === params[1]);
    if (params[2]) rows = rows.filter((p) => p.category === params[2]);
    return { rows };
  }

  if (sql.includes("INSERT INTO customers")) {
    const row = {
      id: randomUUID(),
      user_id: params[0],
      full_name: params[1],
      phone: params[2],
      photo_url: params[3],
      created_at: new Date().toISOString()
    };
    store.customers.push(row);
    return { rows: [row] };
  }

  if (sql.includes("INSERT INTO debts")) {
    const row = {
      id: randomUUID(),
      user_id: params[0],
      customer_id: params[1],
      amount_due: String(params[2]),
      due_date: params[3],
      note: params[4],
      status: params[5]
    };
    store.debts.push(row);
    return { rows: [row] };
  }

  if (sql.includes("FROM customers c") && sql.includes("total_debt")) {
    const rows = store.customers
      .filter((c) => c.user_id === params[0])
      .map((c) => ({ ...c, total_debt: String(customerDebtTotal(c.id)) }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }

  if (sql.includes("FROM customers WHERE user_id")) {
    const rows = store.customers
      .filter((c) => c.user_id === params[0])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }

  if (sql.includes("FROM debts WHERE customer_id")) {
    const rows = store.debts
      .filter((d) => d.customer_id === params[0] && d.user_id === params[1])
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return { rows };
  }

  if (sql.includes("FROM debts") && sql.includes("total_debts")) {
    const userDebts = store.debts.filter((d) => d.user_id === params[0]);
    const summary = {
      total_debts: String(userDebts.length),
      open_amount: String(
        userDebts.filter((d) => d.status === "open").reduce((s, d) => s + Number(d.amount_due), 0)
      ),
      overdue_amount: String(
        userDebts.filter((d) => d.status === "overdue").reduce((s, d) => s + Number(d.amount_due), 0)
      ),
      paid_amount: String(
        userDebts.filter((d) => d.status === "paid").reduce((s, d) => s + Number(d.amount_due), 0)
      )
    };
    return { rows: [summary] };
  }

  if (sql.includes("FROM debts d") && sql.includes("d.status = 'overdue'")) {
    const rows = store.debts
      .filter((d) => d.user_id === params[0] && d.status === "overdue")
      .map((d) => {
        const customer = store.customers.find((c) => c.id === d.customer_id);
        return {
          ...d,
          customer_name: customer?.full_name,
          phone: customer?.phone
        };
      });
    return { rows };
  }

  if (sql.includes("FROM debts WHERE user_id")) {
    let rows = store.debts.filter((d) => d.user_id === params[0]);
    if (params[1]) rows = rows.filter((d) => d.status === params[1]);
    return { rows };
  }

  if (sql.includes("INSERT INTO inventory_items")) {
    const row = {
      id: randomUUID(),
      user_id: params[0],
      name: params[1],
      sku: params[2],
      quantity: params[3],
      reorder_level: params[4],
      unit_price: String(params[5]),
      photo_url: params[6],
      created_at: new Date().toISOString()
    };
    store.inventory_items.push(row);
    return { rows: [row] };
  }

  if (sql.includes("FROM inventory_items") && sql.includes("total_items")) {
    const items = store.inventory_items.filter((i) => i.user_id === params[0]);
    const summary = {
      total_items: String(items.length),
      total_quantity: String(items.reduce((s, i) => s + Number(i.quantity), 0)),
      total_value: String(
        items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0)
      ),
      low_stock_count: String(items.filter((i) => i.quantity <= i.reorder_level).length)
    };
    return { rows: [summary] };
  }

  if (sql.includes("FROM inventory_items")) {
    const rows = store.inventory_items
      .filter((i) => i.user_id === params[0])
      .map((i) => ({
        ...i,
        stock_value: String(Number(i.quantity) * Number(i.unit_price))
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }

  return { rows: [] };
}
