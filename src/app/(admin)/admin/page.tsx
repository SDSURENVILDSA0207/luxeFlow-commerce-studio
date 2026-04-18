import type { Route } from "next";
import Link from "next/link";
import { DashboardKpiGrid } from "@/components/admin/dashboard-kpi-grid";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { Badge } from "@/components/ui";

const campaignRows = [
  {
    label: "Spring Bridal Event",
    status: "Live",
    note: "CTR 5.8% · AOV +11%",
    href: "/c/spring-bridal-event" as Route
  },
  {
    label: "New Arrivals Collection",
    status: "Scaling",
    note: "Email open rate 42%",
    href: "/c/new-arrivals-collection" as Route
  },
  {
    label: "Holiday Gift Guide",
    status: "Planned",
    note: "Creative briefing due tomorrow",
    href: "/c/holiday-gift-guide" as Route
  }
] as const;

const priorities = [
  { text: "Finalize hero assets for Bridal campaign landing page.", href: "/admin/content" as Route },
  { text: "Approve featured collection email before 3:00 PM send window.", href: "/admin/email-templates" as Route },
  { text: "Review A/B result snapshot and select winner variant.", href: "/admin/experiments" as Route }
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="min-w-0 space-y-6">
      <DashboardKpiGrid />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[1.3fr_1fr]">
        <DashboardPanel
          title="Campaign Momentum"
          subtitle="Track active launches and optimization opportunities in one place."
        >
          <div className="space-y-4">
            {campaignRows.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl border border-[#ede3d7] bg-[#fcfaf7] p-4 transition-colors hover:border-[#d5b98f] hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-body-sm font-semibold text-[#33281f]">{item.label}</p>
                  <Badge variant="accent">{item.status}</Badge>
                </div>
                <p className="mt-2 text-body-sm text-[#7c6e5e]">{item.note}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#9b7b4b]">Open live campaign →</p>
              </Link>
            ))}
            <Link
              href={"/admin/campaigns" as Route}
              className="inline-block text-body-sm font-medium text-[#7a5f3d] underline-offset-2 hover:underline"
            >
              Manage in Campaigns
            </Link>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Studio Priorities" subtitle="Today">
          <ul className="space-y-3 text-body-sm text-[#6f6151]">
            {priorities.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-[#ede3d7] bg-[#fcfaf7] px-3 py-2 transition-colors hover:border-[#d5b98f] hover:bg-white"
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </DashboardPanel>
      </div>
    </div>
  );
}
