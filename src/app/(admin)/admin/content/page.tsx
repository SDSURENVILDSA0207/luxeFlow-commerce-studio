import { ContentManagementStudio } from "@/components/admin/content-management-studio";
import { PageHero } from "@/components/ui/page-hero";

export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Content Management"
        description="A lightweight CMS workspace for marketing and web design teams to create, edit, preview, and publish campaign content."
      />
      <ContentManagementStudio />
    </div>
  );
}
