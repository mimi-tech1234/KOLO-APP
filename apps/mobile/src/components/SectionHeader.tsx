import { Text, View } from "react-native";

export function SectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-3xl font-bold text-primary">{title}</Text>
      {subtitle ? <Text className="text-text mt-1">{subtitle}</Text> : null}
    </View>
  );
}
