import { useEffect, useMemo, useState } from "react";
import { Banner, Card, PageHeader } from "../components/ui";
import { api } from "../services/api";

type Item = {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  stock_value: string;
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getInventory()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.stock_value || 0), 0),
    [items]
  );

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Monitor stock levels and total value." />
      <Banner type="info" message={loading ? "Loading inventory..." : null} />
      <Banner type="error" message={error} />
      {items.map((item) => (
        <Card title={item.name} key={item.id}>
          <p className="text-muted">Qty: {item.quantity}</p>
          {item.quantity <= item.reorder_level && (
            <p className="text-danger font-semibold mt-1">Low stock alert</p>
          )}
        </Card>
      ))}
      <Card title="Stock Value">
        <p className="text-2xl font-bold text-primary">NGN {total.toLocaleString()}</p>
      </Card>
    </div>
  );
}
