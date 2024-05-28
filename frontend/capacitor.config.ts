import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dhzdhd.opensms",
  appName: "sms-frontend",
  bundledWebRuntime: false,
  webDir: "out",
  server: {
    allowNavigation: [],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
