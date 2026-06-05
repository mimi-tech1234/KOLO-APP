import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedShell } from "./components/ProtectedShell";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import MoneyPage from "./pages/MoneyPage";
import DebtsPage from "./pages/DebtsPage";
import InventoryPage from "./pages/InventoryPage";
import InsightsPage from "./pages/InsightsPage";
import TrustPage from "./pages/TrustPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route element={<ProtectedShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/money" element={<MoneyPage />} />
        <Route path="/debts" element={<DebtsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/trust" element={<TrustPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
