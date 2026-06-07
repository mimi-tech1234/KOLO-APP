import { useEffect, useState } from "react";
import { Banner, Card, MiniChart, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Summary = { income: number; expense: number; overdueDebt: number; profit: number };
type Trend = { month: number; year: number; profit: number };

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trendValues, setTrendValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getDashboardTrends(7)])
      .then(([summaryData, trends]) => {
        setSummary(summaryData as Summary);
        const profits = (trends as Trend[]).map((t) => t.profit);
        setTrendValues(profits.length ? profits : [0]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your business pulse, updated live from the API." />
      <Banner type="info" message={loading ? "Loading summary..." : null} />
      <Banner type="error" message={error} />
      {summary && (
        <Card title="Financial Overview">
          <p className="text-3xl font-bold text-success">NGN {summary.profit.toLocaleString()}</p>
          <p className="text-muted mt-1">Net profit this month</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-success/10 rounded-xl p-3">
              <p className="text-xs text-success">Income</p>
              <p className="text-lg font-semibold text-success">NGN {summary.income.toLocaleString()}</p>
            </div>
            <div className="bg-danger/10 rounded-xl p-3">
              <p className="text-xs text-danger">Expense</p>
              <p className="text-lg font-semibold text-danger">NGN {summary.expense.toLocaleString()}</p>
            </div>
          </div>
          {summary.overdueDebt > 0 && (
            <p className="text-danger text-sm mt-3 font-medium">
              Overdue debt: NGN {summary.overdueDebt.toLocaleString()}
            </p>
          )}
        </Card>
      )}
      <Card title="Profit Trend">
        <MiniChart values={trendValues} />
      </Card>
    </div>
  );
}
