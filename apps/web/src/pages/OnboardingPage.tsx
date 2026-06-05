import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Banner, Button, Card } from "../components/ui";

const businessTypes = ["Tailor", "Cobbler", "Welder", "Food Vendor", "Hair Braider"];

type Mode = "signup" | "login";

export default function OnboardingPage() {
  const { isAuthenticated, loading, register, login } = useAuth();
  const [mode, setMode] = useState<Mode>("signup");
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedType, setSelectedType] = useState("Tailor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary font-medium">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    if (!identifier.trim()) return "Email or phone is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup") {
      if (!fullName.trim()) return "Full name is required.";
      if (password !== confirmPassword) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        await register({
          fullName,
          identifier,
          password,
          businessType: selectedType
        });
        setSuccess("Account created! Redirecting to dashboard...");
      } else {
        await login(identifier, password);
        setSuccess("Welcome back! Redirecting...");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-primary">Welcome to Kolo</h1>
      <p className="text-muted mt-2 mb-6">Sign up or log in to manage your business.</p>

      <div className="flex bg-surface rounded-2xl p-1 mb-6 border border-primary/10">
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
            mode === "signup" ? "bg-primary text-white" : "text-muted"
          }`}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setSuccess(null);
          }}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
            mode === "login" ? "bg-primary text-white" : "text-muted"
          }`}
        >
          Log In
        </button>
      </div>

      <Card title={mode === "signup" ? "Create your account" : "Welcome back"}>
        {mode === "signup" && (
          <input
            className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10 outline-none focus:border-primary/40"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10 outline-none focus:border-primary/40"
          placeholder="Email or phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10 outline-none focus:border-primary/40"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <>
            <input
              type="password"
              className="w-full bg-background rounded-xl p-3 mb-3 border border-primary/10 outline-none focus:border-primary/40"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-primary font-semibold mb-2">Business Type</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {businessTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-full text-sm ${
                    selectedType === type
                      ? "bg-primary text-white"
                      : "bg-background text-primary border border-primary/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}

        <Button onClick={handleSubmit} loading={submitting} variant="accent">
          {mode === "signup" ? "Create Account" : "Log In"}
        </Button>

        <Banner type="error" message={error} />
        <Banner type="success" message={success} />
      </Card>

      <p className="text-center text-muted text-sm mt-4">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button type="button" className="text-primary font-semibold" onClick={() => setMode("login")}>
              Log in
            </button>
          </>
        ) : (
          <>
            New here?{" "}
            <button type="button" className="text-primary font-semibold" onClick={() => setMode("signup")}>
              Create account
            </button>
          </>
        )}
      </p>
    </div>
  );
}
