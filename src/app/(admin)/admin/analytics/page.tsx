import { AnalyticsDashboardStudio } from "@/components/admin/analytics-dashboard-studio";
import { PageHero } from "@/components/ui/page-hero";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Analytics Dashboard"
        description="A polished marketing analytics workspace for campaign performance, channel outcomes, and conversion intelligence."
      />
      <AnalyticsDashboardStudio />
    </div>
  );
}
