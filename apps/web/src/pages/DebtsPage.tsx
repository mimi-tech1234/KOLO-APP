import { useEffect, useState } from "react";
import { Banner, Button, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Debtor = { id: string; full_name: string; phone: string; total_debt: string };

export default function DebtsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCustomers()
      .then(setDebtors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remind = (phone: string) => {
    window.open(
      `https://wa.me/${phone}?text=Hello%20from%20Kolo%20App.%20A%20friendly%20debt%20reminder.`,
      "_blank"
    );
  };

  return (
    <div>
      <PageHeader title="Customer Debt Book" subtitle="Track credit and send WhatsApp reminders." />
      <Banner type="info" message={loading ? "Loading debtors..." : null} />
      <Banner type="error" message={error} />
      {debtors.map((d) => (
        <Card title={d.full_name} key={d.id}>
          <p className="text-muted mb-2">Debt: {Number(d.total_debt).toLocaleString()}</p>
          <p className={`font-semibold mb-3 ${Number(d.total_debt) > 0 ? "text-danger" : "text-success"}`}>
            {Number(d.total_debt) > 0 ? "Overdue" : "On schedule"}
          </p>
          <Button variant="success" onClick={() => remind(d.phone)}>
            Send WhatsApp Reminder
          </Button>
        </Card>
      ))}
    </div>
  );
}
