import { ReactNode } from "react";
import { View, Text } from "react-native";

export function KoloCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="bg-surface rounded-3xl p-4 mb-4 border border-primary/5 shadow-sm">
      <Text className="text-primary text-base font-semibold mb-3">{title}</Text>
      {children}
    </View>
  );
}
