import { useEffect, useState } from "react";
import { Banner, Button, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Debtor = {
  id: string;
  full_name: string;
  phone: string;
  total_debt: number;
  debts?: { status: string }[];
};

export default function DebtsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCustomersWithDebts()
      .then(setDebtors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remind = (phone: string) => {
    if (!phone) return;
    window.open(
      `https://wa.me/${phone}?text=Hello%20from%20Kolo%20App.%20A%20friendly%20debt%20reminder.`,
      "_blank"
    );
  };

  const isOverdue = (d: Debtor) =>
    Number(d.total_debt) > 0 &&
    (d.debts?.some((debt) => debt.status === "overdue") ?? false);

  return (
    <div>
      <PageHeader title="Customer Debt Book" subtitle="Track credit and send WhatsApp reminders." />
      <Banner type="info" message={loading ? "Loading debtors..." : null} />
      <Banner type="error" message={error} />
      {!loading && debtors.length === 0 && (
        <Card title="No customers yet">
          <p className="text-muted">Add customers and debts from the API to see them here.</p>
        </Card>
      )}
      {debtors.map((d) => (
        <Card title={d.full_name} key={d.id}>
          <p className="text-muted mb-2">Debt: NGN {Number(d.total_debt).toLocaleString()}</p>
          <p
            className={`font-semibold mb-3 ${isOverdue(d) ? "text-danger" : Number(d.total_debt) > 0 ? "text-warm" : "text-success"}`}
          >
            {isOverdue(d) ? "Overdue" : Number(d.total_debt) > 0 ? "Open" : "On schedule"}
          </p>
          {d.phone && (
            <Button variant="success" onClick={() => remind(d.phone)}>
              Send WhatsApp Reminder
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
