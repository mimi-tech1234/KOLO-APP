import { Text, View } from "react-native";

export function StatusBanner({
  type,
  message
}: {
  type: "success" | "error" | "info";
  message: string | null;
}) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-success/15 border-success/40 text-success"
      : type === "error"
        ? "bg-danger/15 border-danger/40 text-danger"
        : "bg-primary/10 border-primary/30 text-primary";

  return (
    <View className={`border rounded-2xl p-3 mt-3 ${styles}`}>
      <Text className="font-medium">{message}</Text>
    </View>
  );
}
