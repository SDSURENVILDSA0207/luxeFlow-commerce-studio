import type { Route } from "next";
import Link from "next/link";
import { DashboardStatCard } from "@/components/admin/dashboard-stat-card";

const kpis: {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  href: Route;
}[] = [
  {
    label: "Revenue (7d)",
    value: "$128.4K",
    delta: "+12.3% vs last week",
    positive: true,
    href: "/studio/analytics#overview"
  },
  {
    label: "Campaign CVR",
    value: "4.82%",
    delta: "+0.6pt from baseline",
    positive: true,
    href: "/studio/analytics#overview"
  },
  {
    label: "Average Order Value",
    value: "$1,420",
    delta: "+8.1% with gift incentive",
    positive: true,
    href: "/studio/analytics#overview"
  },
  {
    label: "Return Rate",
    value: "2.4%",
    delta: "-0.3pt after size guide updates",
    positive: true,
    href: "/studio/analytics#overview"
  }
];

export function DashboardKpiGrid() {
  return (
    <section id="kpi-metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Link
          key={kpi.label}
          href={kpi.href}
          className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#caa774] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f1]"
        >
          <DashboardStatCard label={kpi.label} value={kpi.value} delta={kpi.delta} positive={kpi.positive} />
        </Link>
      ))}
    </section>
  );
}
