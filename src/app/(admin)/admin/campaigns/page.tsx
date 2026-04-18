import { CampaignManagerStudio } from "@/components/admin/campaign-manager-studio";
import { PageHero } from "@/components/ui/page-hero";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Campaign Manager"
        description="Create, schedule, and operate promotions across landing pages, content blocks, and email campaigns."
      />
      <CampaignManagerStudio />
    </div>
  );
}
