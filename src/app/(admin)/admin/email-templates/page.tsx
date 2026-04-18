import { EmailCampaignStudio } from "@/components/admin/email-campaign-studio";
import { PageHero } from "@/components/ui/page-hero";
import { emailTemplates } from "@/modules/email/templates";

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Email Campaign Studio"
        description="Manage template previews and campaign operations with clear scheduling, segmentation, and send-state workflows."
      />
      <EmailCampaignStudio templates={emailTemplates} />
    </div>
  );
}
