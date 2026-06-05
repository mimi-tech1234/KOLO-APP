import { getAuthToken } from "./authStorage";
import { API_BASE_URL } from "../config/env";

async function request(path: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const api = {
  register: (payload: Record<string, unknown>) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: Record<string, unknown>) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getDashboardSummary: () => request("/dashboard/summary"),
  getTransactions: () => request("/transactions"),
  createTransaction: (payload: Record<string, unknown>) =>
    request("/transactions", { method: "POST", body: JSON.stringify(payload) }),
  getCustomers: () => request("/customers"),
  getInventory: () => request("/inventory"),
  getMarketPrices: (region = "Lagos") => request(`/prices?region=${encodeURIComponent(region)}`),
  registerPushToken: (pushToken: string) =>
    request("/devices/push-token", {
      method: "POST",
      body: JSON.stringify({ pushToken })
    })
};
