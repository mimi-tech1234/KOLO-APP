import { useState } from "react";
import { View, Text, Share } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { KoloCard } from "../components/KoloCard";
import {
  registerForPushNotifications,
  scheduleLowStockNotification
} from "../services/notifications";
import { api } from "../services/api";
import { ScreenContainer } from "../components/ScreenContainer";
import { SectionHeader } from "../components/SectionHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { StatusBanner } from "../components/StatusBanner";

type MonthlyReport = {
  totals: { income: number; expense: number; profit: number };
  transactionCount: number;
};

export function TrustShareScreen() {
  const [lockState, setLockState] = useState("Disabled");
  const [pushState, setPushState] = useState("Not registered");
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enableBiometric = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    if (!available) return setLockState("No biometric hardware");
    const auth = await LocalAuthentication.authenticateAsync({ promptMessage: "Enable Kolo Lock" });
    setLockState(auth.success ? "Enabled" : "Failed");
  };

  const setupPush = async () => {
    setError(null);
    try {
      const token = await registerForPushNotifications();
      await api.registerPushToken(token);
      setPushState("Registered");
      await scheduleLowStockNotification("Ankara Fabric Rolls");
    } catch (err) {
      setError((err as Error).message);
      setPushState("Failed");
    }
  };

  const generateReport = async () => {
    setReportLoading(true);
    setError(null);
    try {
      const report = (await api.getMonthlyReport()) as MonthlyReport;
      const message = [
        "Kolo Monthly Summary",
        `Income: NGN ${report.totals.income.toLocaleString()}`,
        `Expense: NGN ${report.totals.expense.toLocaleString()}`,
        `Profit: NGN ${report.totals.profit.toLocaleString()}`,
        `Transactions: ${report.transactionCount}`
      ].join("\n");
      await Share.share({ message, title: "Kolo Monthly Summary" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader title="Trust & Share" subtitle="Protect access and keep trusted family informed." />

      <KoloCard title="App Lock">
        <Text className="mb-2 text-text">Biometric status: {lockState}</Text>
        <PrimaryButton title="Enable Fingerprint/PIN" onPress={enableBiometric} />
      </KoloCard>

      <KoloCard title="Share Reports">
        <Text className="text-text mb-3">
          Generate a monthly summary from your live data and share with trusted contacts.
        </Text>
        <PrimaryButton
          title="Generate Monthly Summary"
          loading={reportLoading}
          onPress={generateReport}
          tone="accent"
        />
      </KoloCard>
      <KoloCard title="Push Alerts">
        <Text className="text-text mb-2">Push status: {pushState}</Text>
        <PrimaryButton title="Enable Debt/Stock Notifications" onPress={setupPush} tone="warm" />
        <StatusBanner type="error" message={error} />
      </KoloCard>
    </ScreenContainer>
  );
}
