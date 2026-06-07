import { useState } from "react";
import { Banner, Button, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type MonthlyReport = {
  totals: { income: number; expense: number; profit: number };
  transactionCount: number;
};

export default function TrustPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportPreview, setReportPreview] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setReportPreview(null);
    try {
      const report = (await api.getMonthlyReport()) as MonthlyReport;
      const text = [
        `Kolo Monthly Summary — ${user?.fullName || "Your business"}`,
        `Income: NGN ${report.totals.income.toLocaleString()}`,
        `Expense: NGN ${report.totals.expense.toLocaleString()}`,
        `Profit: NGN ${report.totals.profit.toLocaleString()}`,
        `Transactions: ${report.transactionCount}`
      ].join("\n");
      setReportPreview(text);

      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kolo-monthly-summary.txt";
      link.click();
      URL.revokeObjectURL(url);

      if (navigator.share) {
        await navigator.share({ title: "Kolo Monthly Summary", text });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Trust & Share" subtitle="Protect access and share reports with trusted contacts." />
      <Card title="Session Security">
        <p className="text-muted mb-2">
          Signed in as <strong>{user?.fullName}</strong>. Your session is secured with JWT tokens.
        </p>
        <Button variant="warm" onClick={logout}>
          Sign Out
        </Button>
      </Card>
      <Card title="Share Reports">
        <p className="text-muted mb-3">
          Generate a monthly summary from your live transaction data and download or share it.
        </p>
        <Button onClick={generateReport} loading={loading} variant="accent">
          Generate Monthly Summary
        </Button>
        <Banner type="error" message={error} />
        {reportPreview && (
          <pre className="mt-4 text-sm text-muted whitespace-pre-wrap bg-background rounded-xl p-3">
            {reportPreview}
          </pre>
        )}
      </Card>
    </div>
  );
}
