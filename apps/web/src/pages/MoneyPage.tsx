import { useState } from "react";
import { Banner, Button, Card, MiniChart, PageHeader } from "../components/ui";
import { api } from "../services/api";

const ranges = ["Daily", "Weekly", "Monthly"];

export default function MoneyPage() {
  const [range, setRange] = useState("Daily");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.createTransaction({
        type: "income",
        category,
        amount: Number(amount),
        transactionDate: new Date().toISOString()
      });
      setSuccess("Transaction saved to backend.");
      setAmount("");
      setCategory("");
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
        <MiniChart values={[20, 38, 61, 42, 74, 69, 85]} />
      </Card>
    </div>
  );
}
