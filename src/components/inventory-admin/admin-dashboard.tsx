"use client";

import type { Route } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminSection, StatusPill } from "@/components/inventory-admin/jewelry-admin-ui";
import { jewelryAdminFetch } from "@/lib/inventory-admin/jewelry-admin-fetch";
import { cn } from "@/lib/utils/cn";

type Stats = {
  inventory: { skuCount: number; lowStockCount: number; outOfStockCount: number };
  suppliers: { total: number; active: number };
  customers: number;
  quotes: { total: number; byStatus: { status: string; _count: { _all: number } }[] };
  orders: {
    total: number;
    pendingFulfillment: number;
    byStatus: { status: string; _count: { _all: number } }[];
  };
};

const quickLinks: { href: Route; label: string; hint: string }[] = [
  { href: "/admin/inventory", label: "Inventory", hint: "SKUs and stock levels" },
  { href: "/admin/suppliers", label: "Suppliers", hint: "Vendors and lead times" },
  { href: "/admin/customers", label: "B2B customers", hint: "Retailer accounts" },
  { href: "/admin/quotes", label: "Quotes", hint: "Trade quotes" },
  { href: "/admin/orders", label: "Orders", hint: "Fulfillment pipeline" }
];

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await jewelryAdminFetch("/api/admin/jewelry/stats");
      if (res.status === 401) return;
      if (!res.ok) {
        setError("Could not load dashboard metrics.");
        return;
      }
      const data = (await res.json()) as Stats;
      setStats(data);
    } catch {
      setError("Network error loading metrics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      void load();
    });
    return () => cancelAnimationFrame(id);
  }, [load]);

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          loading={loading}
          label="SKUs tracked"
          value={stats?.inventory.skuCount ?? "—"}
          sub={stats ? `${stats.inventory.lowStockCount} low · ${stats.inventory.outOfStockCount} out` : ""}
        />
        <MetricCard loading={loading} label="Active suppliers" value={stats ? `${stats.suppliers.active}/${stats.suppliers.total}` : "—"} sub="Vendor relationships" />
        <MetricCard loading={loading} label="B2B customers" value={stats?.customers ?? "—"} sub="Trade accounts" />
        <MetricCard loading={loading} label="Open pipeline" value={stats?.orders.pendingFulfillment ?? "—"} sub="Orders awaiting fulfillment" />
      </div>

      <AdminSection title="Operations snapshot" description="Live counts from the jewelry inventory database.">
        {loading ? (
          <p className="text-sm text-[#78909c]">Loading metrics…</p>
        ) : stats ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#78909c]">Quotes by status</p>
              <ul className="mt-2 space-y-1.5">
                {stats.quotes.byStatus.map((row) => (
                  <li key={row.status} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#546e7a]">{row.status.replace(/_/g, " ")}</span>
                    <span className="font-semibold tabular-nums text-[#263238]">{row._count._all}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#78909c]">Orders by status</p>
              <ul className="mt-2 space-y-1.5">
                {stats.orders.byStatus.map((row) => (
                  <li key={row.status} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#546e7a]">{row.status.replace(/_/g, " ")}</span>
                    <span className="font-semibold tabular-nums text-[#263238]">{row._count._all}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        {!loading && stats ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusPill tone={stats.inventory.outOfStockCount > 0 ? "bad" : "ok"}>Stock health</StatusPill>
            <StatusPill tone="neutral">Total quotes · {stats.quotes.total}</StatusPill>
            <StatusPill tone="neutral">Total orders · {stats.orders.total}</StatusPill>
          </div>
        ) : null}
      </AdminSection>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#78909c]">Modules</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-xl border border-[#cfd8dc] bg-white p-4 shadow-sm transition-colors hover:border-[#90a4ae]"
            >
              <p className="font-display text-base text-[#263238] group-hover:underline">{l.label}</p>
              <p className="mt-1 text-sm text-[#607d8b]">{l.hint}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, loading }: { label: string; value: string | number; sub: string; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-[#cfd8dc] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#78909c]">{label}</p>
      <p className={cn("mt-2 font-display text-3xl tabular-nums text-[#263238]", loading && "animate-pulse text-[#b0bec5]")}>{loading ? "—" : value}</p>
      {sub && !loading ? <p className="mt-1 text-xs text-[#607d8b]">{sub}</p> : null}
    </div>
  );
}
