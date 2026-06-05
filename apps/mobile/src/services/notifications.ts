import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export async function registerForPushNotifications() {
  const { status: currentStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = currentStatus;

  if (currentStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Push notification permission denied.");
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("kolo-alerts", {
      name: "Kolo Alerts",
      importance: Notifications.AndroidImportance.HIGH
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function scheduleLowStockNotification(itemName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Low stock alert",
      body: `${itemName} is running low. Restock soon.`,
      sound: true
    },
    trigger: { seconds: 5, channelId: "kolo-alerts" }
  });
}
