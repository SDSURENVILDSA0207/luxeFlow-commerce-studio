"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent } from "@/components/ui";

const performanceTrend = [
  { week: "W1", campaignPerformance: 62, conversionRate: 2.4 },
  { week: "W2", campaignPerformance: 68, conversionRate: 2.8 },
  { week: "W3", campaignPerformance: 74, conversionRate: 3.1 },
  { week: "W4", campaignPerformance: 81, conversionRate: 3.5 },
  { week: "W5", campaignPerformance: 86, conversionRate: 3.8 }
];

const campaignData = [
  { name: "Spring Bridal Event", value: 94 },
  { name: "New Arrivals", value: 87 },
  { name: "Holiday Gift Guide", value: 76 },
  { name: "Sapphire Capsule", value: 69 }
];

const deviceTraffic = [
  { name: "Mobile", value: 58 },
  { name: "Desktop", value: 34 },
  { name: "Tablet", value: 8 }
];

const topCollections = [
  { name: "Celestial Gold", revenue: "$72.4K", cvr: "4.1%" },
  { name: "Midnight Sapphire", revenue: "$64.8K", cvr: "3.8%" },
  { name: "Pearl Atelier", revenue: "$51.2K", cvr: "3.3%" }
];

const abWinners = [
  { test: "Homepage Hero Narrative", winner: "Variant B", uplift: "+14.7% CTR" },
  { test: "Bridal Campaign Banner Offer", winner: "Variant B", uplift: "+0.43pt CVR" },
  { test: "Promotional Headline Test", winner: "Variant B", uplift: "+13.4% Clicks" }
];

const recentActivity = [
  "Email campaign 'Bridal Private Offer Blast' moved to scheduled.",
  "A/B test 'Homepage Hero Narrative' winner auto-flagged for rollout review.",
  "Campaign 'New Arrivals Collection' conversion rate increased by 0.4pt.",
  "Collection 'Celestial Gold' entered top-revenue leaderboard."
];

function KpiCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
      <CardContent className="space-y-2 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">{label}</p>
        <p className="font-display text-display-lg text-[#2f251b]">{value}</p>
        <p className="text-body-sm text-[#52765a]">{delta}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboardStudio() {
  return (
    <div className="space-y-6">
      <section id="overview" className="scroll-mt-24 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Campaign Performance" value="86 / 100" delta="+8 pts vs last month" />
        <KpiCard label="Email Open Rate" value="42.6%" delta="+3.1% from previous send cycle" />
        <KpiCard label="Email Click Rate" value="8.9%" delta="+1.4% on curated campaigns" />
        <KpiCard label="Conversion Rate" value="3.8%" delta="+0.6pt with optimized landing pages" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Trend</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">Campaign Performance Over Time</h3>
            </div>
            <div className="h-72 min-h-[16rem] min-w-0 w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%" minWidth={280}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid stroke="#eee4d8" vertical={false} />
                  <XAxis dataKey="week" stroke="#8a7b69" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#8a7b69" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#8a7b69" fontSize={12} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="campaignPerformance" stroke="#b98a4f" strokeWidth={3} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#5f7f6a" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Traffic</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">Traffic by Device Type</h3>
            </div>
            <div className="h-72 min-h-[16rem] min-w-0 w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%" minWidth={260}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={deviceTraffic}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#b98a4f"
                    label
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Top Campaigns</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">Top Performing Campaigns</h3>
            </div>
            <div className="h-72 min-h-[16rem] min-w-0 w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                <BarChart data={campaignData} layout="vertical">
                  <CartesianGrid stroke="#eee4d8" horizontal={false} />
                  <XAxis type="number" stroke="#8a7b69" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#8a7b69" fontSize={12} width={130} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#caa774" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Top Collections</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">Collection Leaders</h3>
            </div>
            <div className="space-y-3">
              {topCollections.map((collection) => (
                <div key={collection.name} className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{collection.name}</p>
                  <p className="mt-1 text-body-sm text-[#7b6d5b]">Revenue: {collection.revenue}</p>
                  <p className="text-body-sm text-[#7b6d5b]">Conversion Rate: {collection.cvr}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">A/B Insights</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">A/B Test Winners</h3>
            </div>
            <div className="space-y-3">
              {abWinners.map((item) => (
                <div key={item.test} className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{item.test}</p>
                  <p className="mt-1 text-body-sm text-[#7b6d5b]">Winner: {item.winner}</p>
                  <p className="text-body-sm text-[#52765a]">{item.uplift}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Recent Activity</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2f251b]">Operational Feed</h3>
            </div>
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li key={activity} className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] px-4 py-3 text-body-sm text-[#6f6151]">
                  {activity}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
