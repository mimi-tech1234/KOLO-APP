import { useEffect, useState } from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBanner } from "../components/StatusBanner";

type Debtor = {
  id: string;
  full_name: string;
  phone: string;
  total_debt: number;
  debts?: { status: string }[];
};

export function DebtBookScreen() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await api.getCustomersWithDebts();
        setDebtors(rows);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const remind = async (phone: string) => {
    if (!phone) return;
    const url = `https://wa.me/${phone}?text=Hello%20from%20Kolo%20App.%20A%20friendly%20debt%20reminder.`;
    await Linking.openURL(url);
  };

  const isOverdue = (d: Debtor) =>
    Number(d.total_debt) > 0 &&
    (d.debts?.some((debt) => debt.status === "overdue") ?? false);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Customer Debt Book"
        subtitle="Track customer credit and nudge collections in one tap."
      />
      <StatusBanner type="info" message={loading ? "Loading debtors..." : null} />
      <StatusBanner type="error" message={error} />
      {!loading && debtors.length === 0 && (
        <KoloCard title="No customers yet">
          <Text className="text-text">Add customers and debts to see them here.</Text>
        </KoloCard>
      )}
      {debtors.map((d) => (
        <KoloCard title={d.full_name} key={d.id}>
          <Text className="text-text mb-2">Debt: NGN {Number(d.total_debt).toLocaleString()}</Text>
          {isOverdue(d) ? (
            <Text className="text-danger font-semibold mb-2">Overdue</Text>
          ) : Number(d.total_debt) > 0 ? (
            <Text className="text-warm font-semibold mb-2">Open</Text>
          ) : (
            <Text className="text-success font-semibold mb-2">On schedule</Text>
          )}
          {d.phone ? (
            <Pressable className="bg-success rounded-xl p-3" onPress={() => remind(d.phone)}>
              <Text className="text-white text-center">Send WhatsApp Reminder</Text>
            </Pressable>
          ) : null}
        </KoloCard>
      ))}
    </ScreenContainer>
  );
}
