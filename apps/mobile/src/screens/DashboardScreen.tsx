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

export function DashboardScreen() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
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
          </Animated.View>
        )}
      </KoloCard>

      <KoloCard title="30-Day Profit Trend">
        <View className="h-28 rounded-2xl bg-primary/10 px-3 py-3">
          <View className="flex-row h-full items-end justify-between">
            {[32, 44, 26, 59, 71, 63, 80].map((v, idx) => (
              <View key={idx} className="w-7 rounded-lg bg-primary/80" style={{ height: `${v}%` }} />
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
