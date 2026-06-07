import { useEffect, useMemo, useState } from "react";
import { Banner, Button, Card, MiniChart, PageHeader } from "../components/ui";
import { api } from "../services/api";

const ranges = ["Daily", "Weekly", "Monthly"] as const;

type Transaction = {
  type: string;
  amount: string;
  transaction_date: string;
};

function filterByRange(transactions: Transaction[], range: (typeof ranges)[number]) {
  const now = new Date();
  const start = new Date(now);
  if (range === "Daily") start.setHours(0, 0, 0, 0);
  else if (range === "Weekly") start.setDate(now.getDate() - 7);
  else start.setMonth(now.getMonth() - 1);
  return transactions.filter((t) => new Date(t.transaction_date) >= start);
}

function chartFromTransactions(transactions: Transaction[]) {
  const buckets = Array.from({ length: 7 }, () => 0);
  transactions.forEach((t) => {
    const day = new Date(t.transaction_date).getDay();
    const signed = t.type === "income" ? Number(t.amount) : -Number(t.amount);
    buckets[day] += signed;
  });
  return buckets.map((v) => Math.abs(v));
}

export default function MoneyPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Daily");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = () => {
    api
      .getTransactions()
      .then((rows) => setTransactions(rows as Transaction[]))
      .catch(() => {});
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const chartValues = useMemo(
    () => chartFromTransactions(filterByRange(transactions, range)),
    [transactions, range]
  );

  const submit = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.createTransaction({
        type,
        category,
        amount: Number(amount),
        transactionDate: new Date().toISOString()
      });
      setSuccess("Transaction saved to backend.");
      setAmount("");
      setCategory("");
      loadTransactions();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Money Tracker" subtitle="Capture sales and expenses with live API sync." />
      <Card title="Quick Entry">
        <div className="flex gap-2 mb-3">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 px-3 py-2 rounded-full text-sm capitalize ${
                type === t ? "bg-primary text-white" : "bg-background text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          className="w-full bg-background rounded-xl p-3 mb-2 border border-primary/10"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button onClick={submit} loading={loading} variant="accent">
          Save Transaction
        </Button>
        <Banner type="success" message={success} />
        <Banner type="error" message={error} />
      </Card>
      <Card title="Insights View">
        <div className="flex gap-2 mb-3">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-2 rounded-full text-sm ${range === r ? "bg-primary text-white" : "bg-background text-primary"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <MiniChart values={chartValues} />
      </Card>
    </div>
  );
}
