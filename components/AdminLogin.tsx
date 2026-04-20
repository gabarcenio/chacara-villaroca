"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VENUE } from "@/lib/constants";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setError("Senha incorreta.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5">
      <div className="w-full max-w-sm">
        <p className="mb-1 text-center text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "2rem" }}>
          {VENUE.name.replace("Chácara ", "")}
        </p>
        <h1 className="mb-8 text-center text-xl text-muted-foreground">Acesso administrativo</h1>

        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-sm">
          <label className="mb-2 block text-sm font-medium">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border-2 border-transparent bg-secondary px-4 py-3 outline-none transition-colors focus:border-primary"
            placeholder="••••••••"
            autoFocus
          />

          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
