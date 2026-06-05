import { useEffect, useState } from "react";
import { Banner, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Price = {
  id: string;
  item_name: string;
  benchmark_price: string;
  currency: string;
};

export default function InsightsPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMarketPrices("Lagos")
      .then(setPrices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
        <p className="text-success font-semibold">Margin: 32%</p>
      </Card>
      <Card title="Anomaly Alerts">
        <p className="text-danger">Expense spike detected on Monday (+48%).</p>
      </Card>
    </div>
  );
}
