import { useState } from "react";
import { View, Text, Pressable } from "react-native";
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

export function TrustShareScreen() {
  const [lockState, setLockState] = useState("Disabled");
  const [pushState, setPushState] = useState("Not registered");
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

  return (
    <ScreenContainer>
      <SectionHeader title="Trust & Share" subtitle="Protect access and keep trusted family informed." />

      <KoloCard title="App Lock">
        <Text className="mb-2 text-text">Biometric status: {lockState}</Text>
        <PrimaryButton title="Enable Fingerprint/PIN" onPress={enableBiometric} />
      </KoloCard>

      <KoloCard title="Share Reports">
        <Text className="text-text">Generate PDF/image report and share with trusted contacts.</Text>
        <Pressable className="mt-3 bg-accent rounded-xl p-3">
          <Text className="text-primary text-center font-semibold">Generate Monthly Summary</Text>
        </Pressable>
      </KoloCard>
      <KoloCard title="Push Alerts">
        <Text className="text-text mb-2">Push status: {pushState}</Text>
        <PrimaryButton title="Enable Debt/Stock Notifications" onPress={setupPush} tone="warm" />
        <StatusBanner type="error" message={error} />
      </KoloCard>
    </ScreenContainer>
  );
}
