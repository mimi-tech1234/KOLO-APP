import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBanner } from "../components/StatusBanner";

type PriceBenchmark = {
  id: string;
  item_name: string;
  benchmark_price: string;
  currency: string;
};

export function AntiScamScreen() {
  const [prices, setPrices] = useState<PriceBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await api.getMarketPrices("Lagos");
        setPrices(rows);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ScreenContainer>
      <SectionHeader
        title="Anti-Scam Insights"
        subtitle="Benchmark prices and flag anomalies before losses happen."
      />
      <StatusBanner type="info" message={loading ? "Loading benchmarks..." : null} />
      <StatusBanner type="error" message={error} />
      <KoloCard title="Market Price Checker">
        {!loading && !error && prices[0] && (
          <Text className="text-text">
            {prices[0].item_name}: {prices[0].currency} {Number(prices[0].benchmark_price).toLocaleString()}
          </Text>
        )}
      </KoloCard>
      <KoloCard title="Profit Margin Calculator">
        <Text className="text-success font-semibold">Margin: 32%</Text>
      </KoloCard>
      <KoloCard title="Anomaly Alerts">
        <Text className="text-danger">Expense spike detected on Monday (+48%).</Text>
      </KoloCard>
    </ScreenContainer>
  );
}
