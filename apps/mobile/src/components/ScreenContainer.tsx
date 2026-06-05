import { ReactNode } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

export function ScreenContainer({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 120 }}>
        <View>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
