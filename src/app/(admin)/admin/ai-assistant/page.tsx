import { AICopyAssistantStudio } from "@/components/admin/ai-copy-assistant-studio";
import { PageHero } from "@/components/ui/page-hero";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="AI Copy Assistant"
        description="Generate premium campaign messaging, subject lines, and CTA options with a clean copy-to-editor workflow."
      />
      <AICopyAssistantStudio />
    </div>
  );
}
