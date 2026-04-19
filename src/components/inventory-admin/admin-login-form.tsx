"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathOnly = (searchParams.get("from") ?? "/admin").split("?")[0] || "/admin";
  const from =
    pathOnly.startsWith("/admin") && !pathOnly.startsWith("/admin/login") ? pathOnly : "/admin";
  const configError = searchParams.get("error") === "config";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(configError ? "Server configuration is incomplete." : null);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          credentials: "include"
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Sign-in failed.");
          return;
        }
        const dest = (from.startsWith("/admin") ? from : "/admin") as Route;
        router.replace(dest);
        router.refresh();
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    },
    [from, password, router]
  );

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
          {error}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium text-[#37474f]">
          Password
        </label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="w-full"
          required
        />
        <p className="text-xs text-[#78909c]">Set ADMIN_PASSWORD in your environment for this deployment.</p>
      </div>
      <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
