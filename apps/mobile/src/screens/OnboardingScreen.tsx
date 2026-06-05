import { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { setAuthToken } from "../services/authStorage";
import { ScreenContainer } from "../components/ScreenContainer";
import { PrimaryButton } from "../components/PrimaryButton";
import { StatusBanner } from "../components/StatusBanner";

const businessTypes = ["Tailor", "Cobbler", "Welder", "Food Vendor", "Hair Braider"];

export function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [selectedType, setSelectedType] = useState("Tailor");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const hasEmail = identifier.includes("@");
      await api.register({
        fullName: "Kolo User",
        email: hasEmail ? identifier : null,
        phone: hasEmail ? null : identifier,
        password,
        businessType: selectedType,
        preferredCurrency: "NGN"
      });
      const login = await api.login({ identifier, password });
      await setAuthToken(login.token);
      navigation.replace("Main");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text className="text-4xl font-bold text-primary">Welcome to Kolo</Text>
      <Text className="text-text mt-2 mb-6">
        A premium finance workspace for ambitious African business owners.
      </Text>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=800" }}
        className="w-full h-52 rounded-3xl mb-6"
      />
      <TextInput
        className="bg-surface rounded-2xl p-4 mb-3"
        placeholder="Email or Phone"
        value={identifier}
        onChangeText={setIdentifier}
      />
      <TextInput
        className="bg-surface rounded-2xl p-4 mb-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text className="text-primary font-semibold mb-2">Business Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {businessTypes.map((type) => (
          <Pressable
            key={type}
            onPress={() => setSelectedType(type)}
            className={`px-3 py-2 rounded-full ${selectedType === type ? "bg-primary" : "bg-surface"}`}
          >
            <Text className={selectedType === type ? "text-white" : "text-primary"}>{type}</Text>
          </Pressable>
        ))}
      </View>
      <PrimaryButton title="Create Account" loading={loading} onPress={submit} tone="accent" />
      <StatusBanner type="error" message={error} />
    </ScreenContainer>
  );
}
