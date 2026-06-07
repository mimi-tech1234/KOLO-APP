import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import * as Speech from "expo-speech";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { enqueueOfflineAction, getPendingCount } from "../services/offlineQueue";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { StatusBanner } from "../components/StatusBanner";

const ranges = ["Daily", "Weekly", "Monthly"] as const;

type Transaction = {
  type: string;
  amount: string;
  transaction_date: string;
};

function filterByRange(transactions: Transaction[], range: (typeof ranges)[number]) {
  const now = new Date();
  const start = new Date(now);
  if (range === "Daily") start.setHours(0, 0, 0, 0);
  else if (range === "Weekly") start.setDate(now.getDate() - 7);
  else start.setMonth(now.getMonth() - 1);
  return transactions.filter((t) => new Date(t.transaction_date) >= start);
}

function chartFromTransactions(transactions: Transaction[]) {
  const buckets = Array.from({ length: 7 }, () => 0);
  transactions.forEach((t) => {
    const day = new Date(t.transaction_date).getDay();
    const signed = t.type === "income" ? Number(t.amount) : -Number(t.amount);
    buckets[day] += signed;
  });
  const max = Math.max(...buckets.map(Math.abs), 1);
  return buckets.map((v) => Math.round((Math.abs(v) / max) * 100));
}

export function MoneyTrackerScreen() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Daily");
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(0);

  const loadTransactions = async () => {
    try {
      const rows = await api.getTransactions();
      setTransactions(rows);
    } catch {
      // keep chart empty when offline
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const chartValues = useMemo(
    () => chartFromTransactions(filterByRange(transactions, range)),
    [transactions, range]
  );

  const submitTransaction = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    const payload = {
      type,
      category,
      amount: Number(amount),
      transactionDate: new Date().toISOString()
    };

    try {
      await api.createTransaction(payload);
      setSuccess("Transaction saved.");
      setAmount("");
      setCategory("");
      await loadTransactions();
    } catch {
      await enqueueOfflineAction({
        endpoint: "/transactions",
        method: "POST",
        payload,
        createdAt: new Date().toISOString()
      });
      const count = await getPendingCount();
      setPending(count);
      setError("No internet/API unavailable. Saved to offline queue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader
        title="Money Tracker"
        subtitle="Capture transactions fast, even when connectivity is unstable."
      />

      <KoloCard title="Quick Entry">
        <View className="flex-row gap-2 mb-3">
          {(["income", "expense"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              className={`flex-1 px-3 py-2 rounded-full ${type === t ? "bg-primary" : "bg-background"}`}
            >
              <Text className={`text-center capitalize ${type === t ? "text-white" : "text-primary"}`}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          className="bg-background rounded-xl p-3 mb-2"
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          className="bg-background rounded-xl p-3 mb-2"
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <PrimaryButton title="Save Transaction" loading={loading} onPress={submitTransaction} tone="accent" />
        <View className="mb-2" />
        <Pressable
          className="bg-primary rounded-xl p-3"
          onPress={() => Speech.speak("Say the amount and category after the beep")}
        >
          <Text className="text-white text-center font-semibold">Use Voice Input</Text>
        </Pressable>
        <StatusBanner type="success" message={success} />
        <StatusBanner type="error" message={error} />
        <StatusBanner
          type="info"
          message={pending > 0 ? `Pending offline sync: ${pending}` : null}
        />
      </KoloCard>

      <KoloCard title="Insights View">
        <View className="flex-row gap-2 mb-3">
          {ranges.map((item) => (
            <Pressable
              key={item}
              onPress={() => setRange(item)}
              className={`px-3 py-2 rounded-full ${range === item ? "bg-primary" : "bg-background"}`}
            >
              <Text className={range === item ? "text-white" : "text-primary"}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <View className="h-28 bg-accent/20 rounded-xl px-3 py-3">
          <View className="flex-row h-full items-end justify-between">
            {chartValues.map((v, idx) => (
              <View
                key={`${range}-${idx}`}
                className="w-6 rounded-md bg-primary/80"
                style={{ height: `${Math.max(v, 4)}%` }}
              />
            ))}
          </View>
        </View>
      </KoloCard>
    </ScreenContainer>
  );
}
