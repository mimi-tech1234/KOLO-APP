import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBanner } from "../components/StatusBanner";

type Summary = {
  income: number;
  expense: number;
  overdueDebt: number;
  profit: number;
};

type Trend = { profit: number };

function toChartHeights(values: number[]) {
  const max = Math.max(...values, 1);
  return values.map((v) => Math.round((v / max) * 100));
}

export function DashboardScreen() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trendValues, setTrendValues] = useState<number[]>([0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, trends] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardTrends(7)
        ]);
        setSummary(data as Summary);
        const profits = (trends as Trend[]).map((t) => t.profit);
        setTrendValues(profits.length ? toChartHeights(profits) : [0]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    }
  }, [loading, error, fade]);

  return (
    <ScreenContainer>
      <SectionHeader title="Dashboard" subtitle="Your business pulse, updated live." />
      <StatusBanner type="info" message={loading ? "Loading summary..." : null} />
      <StatusBanner type="error" message={error} />

      <KoloCard title="Financial Overview">
        {!loading && !error && summary && (
          <Animated.View style={{ opacity: fade }}>
            <Text className="text-3xl text-success font-bold">NGN {summary.profit.toLocaleString()}</Text>
            <Text className="text-text mt-1">Net profit this month</Text>
            <View className="mt-4 flex-row gap-2">
              <View className="bg-success/10 rounded-xl p-3 flex-1">
                <Text className="text-xs text-success">Income</Text>
                <Text className="text-lg font-semibold text-success">NGN {summary.income.toLocaleString()}</Text>
              </View>
              <View className="bg-danger/10 rounded-xl p-3 flex-1">
                <Text className="text-xs text-danger">Expense</Text>
                <Text className="text-lg font-semibold text-danger">NGN {summary.expense.toLocaleString()}</Text>
              </View>
            </View>
            {summary.overdueDebt > 0 && (
              <Text className="text-danger text-sm mt-3 font-medium">
                Overdue debt: NGN {summary.overdueDebt.toLocaleString()}
              </Text>
            )}
          </Animated.View>
        )}
      </KoloCard>

      <KoloCard title="Profit Trend">
        <View className="h-28 rounded-2xl bg-primary/10 px-3 py-3">
          <View className="flex-row h-full items-end justify-between">
            {trendValues.map((v, idx) => (
              <View
                key={idx}
                className="w-7 rounded-lg bg-primary/80"
                style={{ height: `${Math.max(v, 4)}%` }}
              />
            ))}
          </View>
        </View>
      </KoloCard>

      <Pressable className="absolute right-6 bottom-8 bg-warm w-14 h-14 rounded-full items-center justify-center">
        <Text className="text-white text-3xl -mt-1">+</Text>
      </Pressable>
    </ScreenContainer>
  );
}
