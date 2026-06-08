import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kolo.app",
  appName: "Kolo App",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
