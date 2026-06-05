import { NavLink, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/money", label: "Money", icon: "💰" },
  { to: "/debts", label: "Debts", icon: "🧾" },
  { to: "/inventory", label: "Inventory", icon: "📦" },
  { to: "/insights", label: "Insights", icon: "📈" },
  { to: "/trust", label: "Trust", icon: "🛡️" }
];

export function ProtectedShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary font-medium">Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-white px-6 py-4 shadow-md flex items-center justify-between">
        <div>
          <p className="text-accent text-sm font-semibold">Kolo App</p>
          <p className="text-white/90 text-sm">
            Hello, {user?.fullName || "Business Owner"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="text-sm bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl transition-colors"
        >
          Log out
        </button>
      </div>
      <main className="max-w-3xl mx-auto px-5 py-6">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/10 px-2 py-2">
        <div className="max-w-3xl mx-auto grid grid-cols-6 gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center py-2 rounded-xl text-xs ${
                location.pathname === item.to
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
