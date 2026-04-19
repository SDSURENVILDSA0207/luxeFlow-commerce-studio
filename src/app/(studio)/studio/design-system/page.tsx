import { DesignSystemShowcase } from "@/components/ui/design-system-showcase";
import { PageHero } from "@/components/ui/page-hero";

export default function DesignSystemPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="LuxeFlow Design System"
        description="Luxury-inspired UI foundations for a sophisticated commerce and campaign studio."
      />
      <DesignSystemShowcase />
    </div>
  );
}
