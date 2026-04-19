import { AbTestingStudio } from "@/components/admin/ab-testing-studio";
import { PageHero } from "@/components/ui/page-hero";

export default function ExperimentsPage() {
  return (
    <div className="min-w-0 space-y-6">
      <PageHero
        eyebrow="Admin"
        title="A/B Testing"
        description="Design, launch, and evaluate conversion-focused experiments across hero copy, campaign banners, CTA text, and promotional headlines."
      />
      <AbTestingStudio />
    </div>
  );
}
