const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";
const TOKEN_KEY = "kolo_token";
const USER_KEY = "kolo_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setStoredUser(user: Record<string, unknown>) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): Record<string, unknown> | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach API. Start the backend with: npm run dev:api");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

export const api = {
  register: (payload: Record<string, unknown>) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: Record<string, unknown>) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  getDashboardSummary: () => request("/dashboard/summary"),
  getDashboardTrends: (months = 6) =>
    request(`/dashboard/trends?months=${months}`),
  getMonthlyReport: () => request("/dashboard/report"),
  getTransactions: () => request("/transactions"),
  getCustomers: () => request("/customers"),
  getCustomersWithDebts: () => request("/customers/with-debts"),
  getInventory: () => request("/inventory"),
  getMarketPrices: (region = "Lagos") =>
    request(`/market/prices?region=${encodeURIComponent(region)}`),
  calculateMargin: (payload: { itemName: string; sellingPrice: number; region: string }) =>
    request("/market/calculate-margin", { method: "POST", body: JSON.stringify(payload) }),
  createTransaction: (payload: Record<string, unknown>) =>
    request("/transactions", { method: "POST", body: JSON.stringify(payload) })
};

export async function checkApiHealth() {
  const res = await fetch(`${API_BASE.replace("/api", "")}/health`);
  return res.json();
}
