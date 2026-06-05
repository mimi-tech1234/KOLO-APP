import { ReactNode } from "react";

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-surface rounded-3xl p-5 mb-4 border border-primary/5 shadow-sm">
      <h3 className="text-primary font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
    </header>
  );
}

export function Banner({
  type,
  message
}: {
  type: "success" | "error" | "info";
  message: string | null;
}) {
  if (!message) return null;
  const cls =
    type === "success"
      ? "bg-success/15 text-success border-success/30"
      : type === "error"
        ? "bg-danger/15 text-danger border-danger/30"
        : "bg-primary/10 text-primary border-primary/30";
  return <div className={`border rounded-2xl p-3 mb-4 ${cls}`}>{message}</div>;
}

export function Button({
  children,
  onClick,
  loading,
  variant = "primary"
}: {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: "primary" | "accent" | "warm" | "success";
}) {
  const bg =
    variant === "accent"
      ? "bg-accent text-primary"
      : variant === "warm"
        ? "bg-warm text-white"
        : variant === "success"
          ? "bg-success text-white"
          : "bg-primary text-white";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`w-full rounded-2xl p-3 font-semibold transition-opacity ${bg} ${loading ? "opacity-70" : "hover:opacity-90"}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function MiniChart({ values }: { values: number[] }) {
  return (
    <div className="h-28 rounded-2xl bg-primary/10 px-3 py-3 flex items-end justify-between gap-1">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-lg bg-primary/80" style={{ height: `${v}%` }} />
      ))}
    </div>
  );
}
