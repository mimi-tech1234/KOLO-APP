import { Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  title: string;
  loading?: boolean;
  onPress: () => void;
  tone?: "primary" | "accent" | "warm";
};

export function PrimaryButton({ title, loading, onPress, tone = "primary" }: PrimaryButtonProps) {
  const toneClass =
    tone === "accent" ? "bg-accent" : tone === "warm" ? "bg-warm" : "bg-primary";
  const textClass = tone === "accent" ? "text-primary" : "text-white";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`${toneClass} rounded-2xl p-4 active:opacity-90 ${loading ? "opacity-70" : ""}`}
    >
      <Text className={`${textClass} text-center text-base font-semibold`}>
        {loading ? "Please wait..." : title}
      </Text>
    </Pressable>
  );
}
