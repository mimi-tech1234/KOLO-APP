import { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBanner } from "../components/StatusBanner";
import { PrimaryButton } from "../components/PrimaryButton";

type PriceBenchmark = {
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

export function AntiScamScreen() {
  const [prices, setPrices] = useState<PriceBenchmark[]>([]);
  const [itemName, setItemName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [margin, setMargin] = useState<MarginResult | null>(null);
  const [anomaly, setAnomaly] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [calcLoading, setCalcLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rows, txRows] = await Promise.all([
          api.getMarketPrices("Lagos"),
          api.getTransactions()
        ]);
        setPrices(rows);
        if (rows[0]) setItemName(rows[0].item_name);
        setAnomaly(detectExpenseAnomaly(txRows));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
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
      setMargin(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader
        title="Anti-Scam Insights"
        subtitle="Benchmark prices and flag anomalies before losses happen."
      />
      <StatusBanner type="info" message={loading ? "Loading benchmarks..." : null} />
      <StatusBanner type="error" message={error} />
      <KoloCard title="Market Price Checker">
        {prices.map((p) => (
          <Text key={p.id} className="text-text mb-1">
            {p.item_name}: {p.currency} {Number(p.benchmark_price).toLocaleString()}
          </Text>
        ))}
      </KoloCard>
      <KoloCard title="Profit Margin Calculator">
        <TextInput
          className="bg-background rounded-xl p-3 mb-2"
          placeholder="Item name"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          className="bg-background rounded-xl p-3 mb-2"
          placeholder="Your selling price"
          keyboardType="numeric"
          value={sellingPrice}
          onChangeText={setSellingPrice}
        />
        <PrimaryButton title="Calculate Margin" loading={calcLoading} onPress={calculate} />
        {margin?.success && (
          <Text className="text-success font-semibold mt-3">
            Margin: {margin.marginPercent}% — {margin.status}
          </Text>
        )}
        {margin && !margin.success && <Text className="text-text mt-3">{margin.message}</Text>}
      </KoloCard>
      <KoloCard title="Anomaly Alerts">
        <Text className={anomaly ? "text-danger" : "text-text"}>
          {anomaly || "No unusual spending patterns detected."}
        </Text>
      </KoloCard>
    </ScreenContainer>
  );
}
