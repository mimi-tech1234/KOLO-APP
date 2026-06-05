import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingScreen } from "../src/screens/OnboardingScreen";
import { DashboardScreen } from "../src/screens/DashboardScreen";
import { MoneyTrackerScreen } from "../src/screens/MoneyTrackerScreen";
import { DebtBookScreen } from "../src/screens/DebtBookScreen";
import { InventoryScreen } from "../src/screens/InventoryScreen";
import { AntiScamScreen } from "../src/screens/AntiScamScreen";
import { TrustShareScreen } from "../src/screens/TrustShareScreen";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: "grid-outline",
  Money: "wallet-outline",
  Debts: "people-outline",
  Inventory: "cube-outline",
  Insights: "trending-up-outline",
  Trust: "shield-checkmark-outline"
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1B1F5E",
        tabBarInactiveTintColor: "#58607A",
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopColor: "#EEF0F8"
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconByRoute[route.name] || "ellipse-outline"} size={size} color={color} />
        )
      })}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Money" component={MoneyTrackerScreen} />
      <Tabs.Screen name="Debts" component={DebtBookScreen} />
      <Tabs.Screen name="Inventory" component={InventoryScreen} />
      <Tabs.Screen name="Insights" component={AntiScamScreen} />
      <Tabs.Screen name="Trust" component={TrustShareScreen} />
    </Tabs.Navigator>
  );
}

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
