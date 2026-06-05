import { useEffect } from "react";
import RootLayout from "./app/_layout";
import { api } from "./src/services/api";
import { API_BASE_URL } from "./src/config/env";
import {
  flushOfflineQueue,
  initializeOfflineQueue
} from "./src/services/offlineQueue";
import "./global.css";

export default function App() {
  useEffect(() => {
    const bootstrap = async () => {
      await initializeOfflineQueue();
      await flushOfflineQueue(async (item) => {
        await fetch(`${API_BASE_URL}${item.endpoint}`, {
          method: item.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload)
        });
      });
      try {
        await api.registerPushToken("bootstrap");
      } catch {
        // Push registration is optional on web.
      }
    };
    bootstrap().catch(() => {
      // App remains usable offline when bootstrap sync fails.
    });
  }, []);

  return <RootLayout />;
}
