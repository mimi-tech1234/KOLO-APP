import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBanner } from "../components/StatusBanner";
import { scheduleLowStockNotification } from "../services/notifications";

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  reorder_level: number;
  stock_value: string;
};

export function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await api.getInventory();
        setItems(rows);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalStockValue = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.stock_value || 0), 0),
    [items]
  );

  return (
    <ScreenContainer>
      <SectionHeader title="Inventory" subtitle="Control quantities, restock early, protect your margins." />
      <StatusBanner type="info" message={loading ? "Loading inventory..." : null} />
      <StatusBanner type="error" message={error} />
      {items.map((item) => (
        <KoloCard title={item.name} key={item.id}>
          <Text className="text-text">Qty: {item.quantity}</Text>
          {item.quantity <= item.reorder_level && (
            <>
              <Text className="text-danger font-semibold mt-1">Low stock alert</Text>
              <Pressable
                className="mt-2 bg-warm rounded-lg px-3 py-2"
                onPress={() => scheduleLowStockNotification(item.name)}
              >
                <Text className="text-white text-center text-xs font-medium">Notify Me</Text>
              </Pressable>
            </>
          )}
        </KoloCard>
      ))}
      <KoloCard title="Stock Value">
        <Text className="text-2xl text-primary font-bold">NGN {totalStockValue.toLocaleString()}</Text>
      </KoloCard>
    </ScreenContainer>
  );
}
