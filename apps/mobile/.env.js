// Mobile App Environment Configuration
export const ENV = {
  // Development
  DEV_API_BASE_URL: "http://localhost:4000/api",
  
  // Production
  PROD_API_BASE_URL: "https://api.koloapp.com/api",
  
  // Current
  API_BASE_URL: __DEV__ ? "http://localhost:4000/api" : "https://api.koloapp.com/api",
  
  // App Settings
  APP_NAME: "Kolo App",
  VERSION: "1.0.0",
  BUILD: 1,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "@kolo_auth_token",
  USER: "@kolo_user",
  PREFERENCES: "@kolo_preferences",
  TRANSACTIONS: "@kolo_transactions",
  OFFLINE_QUEUE: "@kolo_offline_queue",
};
