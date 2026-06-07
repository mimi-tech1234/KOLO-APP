import { useEffect, useState } from "react";
import { Banner, Button, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Price = {
  id: string;
  item_name: string;
  benchmark_price: string;
  currency: string;
};

type Transaction = { type: string; amount: string; transaction_date: string };

type MarginResult = {
  success: boolean;
  marginPercent?: number;
  status?: string;
  message?: string;
};

function detectExpenseAnomaly(transactions: Transaction[]): string | null {
  const expenses = transactions.filter((t) => t.type === "expense");
  if (expenses.length < 3) return null;

  const byDay: Record<number, number> = {};
  expenses.forEach((t) => {
    const day = new Date(t.transaction_date).getDay();
    byDay[day] = (byDay[day] || 0) + Number(t.amount);
  });

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const totals = Object.values(byDay);
  const avg = totals.reduce((s, v) => s + v, 0) / totals.length;
  const peakDay = Object.entries(byDay).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
  if (!peakDay || avg === 0) return null;

  const spike = ((Number(peakDay[1]) - avg) / avg) * 100;
  if (spike < 30) return null;
  return `Expense spike detected on ${days[Number(peakDay[0])]} (+${Math.round(spike)}%).`;
}

export default function InsightsPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [itemName, setItemName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [margin, setMargin] = useState<MarginResult | null>(null);
  const [anomaly, setAnomaly] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getMarketPrices("Lagos"), api.getTransactions()])
      .then(([priceRows, txRows]) => {
        setPrices(priceRows as Price[]);
        if ((priceRows as Price[])[0]) setItemName((priceRows as Price[])[0].item_name);
        setAnomaly(detectExpenseAnomaly(txRows as Transaction[]));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const calculate = async () => {
    setCalcLoading(true);
    setError(null);
    try {
      const result = await api.calculateMargin({
        itemName,
        sellingPrice: Number(sellingPrice),
        region: "Lagos"
      });
      setMargin(result as MarginResult);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Anti-Scam Insights" subtitle="Benchmark prices and protect your margins." />
      <Banner type="info" message={loading ? "Loading benchmarks..." : null} />
      <Banner type="error" message={error} />
      <Card title="Market Price Checker">
        {prices.map((p) => (
          <p key={p.id} className="text-muted mb-1">
            {p.item_name}: {p.currency} {Number(p.benchmark_price).toLocaleString()}
          </p>
        ))}
      </Card>
      <Card title="Profit Margin Calculator">
        <input
          className="w-full bg-background rounded-xl p-3 mb-2 border border-primary/10"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10"
          placeholder="Your selling price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
        <Button onClick={calculate} loading={calcLoading}>
          Calculate Margin
        </Button>
        {margin?.success && (
          <p className="text-success font-semibold mt-3">
            Margin: {margin.marginPercent}% — {margin.status}
          </p>
        )}
        {margin && !margin.success && (
          <p className="text-muted mt-3">{margin.message}</p>
        )}
      </Card>
      <Card title="Anomaly Alerts">
        <p className={anomaly ? "text-danger" : "text-muted"}>
          {anomaly || "No unusual spending patterns detected."}
        </p>
      </Card>
    </div>
  );
}
