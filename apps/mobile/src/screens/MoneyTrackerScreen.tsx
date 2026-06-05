import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import * as Speech from "expo-speech";
import { KoloCard } from "../components/KoloCard";
import { api } from "../services/api";
import { enqueueOfflineAction, getPendingCount } from "../services/offlineQueue";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { StatusBanner } from "../components/StatusBanner";

const ranges = ["Daily", "Weekly", "Monthly"];

export function MoneyTrackerScreen() {
  const [range, setRange] = useState("Daily");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(0);

  const submitTransaction = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    const payload = {
      type: "income",
      category,
      amount: Number(amount),
      transactionDate: new Date().toISOString()
    };

    try {
      await api.createTransaction(payload);
      setSuccess("Transaction saved.");
      setAmount("");
      setCategory("");
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
          onPress={() => Speech.speak("Voice capture started")}
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
            {[20, 38, 61, 42, 74, 69, 85].map((v, idx) => (
              <View key={`${range}-${idx}`} className="w-6 rounded-md bg-primary/80" style={{ height: `${v}%` }} />
            ))}
          </View>
        </View>
      </KoloCard>
    </ScreenContainer>
  );
}
