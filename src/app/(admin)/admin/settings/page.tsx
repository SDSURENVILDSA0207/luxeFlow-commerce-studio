import { SettingsWorkspaceForm } from "@/components/admin/settings-workspace-form";
import { PageHero } from "@/components/ui/page-hero";
import { Card, CardContent } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="min-w-0 space-y-6">
      <PageHero
        eyebrow="Admin"
        title="Settings"
        description="Configure team roles, integrations, and operational defaults for a polished commerce workflow."
      />

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Team & Permissions</p>
            <h3 className="text-heading-lg text-[#2f251b]">Role Access</h3>
            <p className="text-body-sm text-[#7b6d5b]">Manage admin permissions for designers, marketers, and merchandisers.</p>
            <SettingsWorkspaceForm />
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-3 p-5">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Integrations</p>
            <h3 className="text-heading-lg text-[#2f251b]">Connected Services</h3>
            <p className="text-body-sm text-[#7b6d5b]">Configure email provider, analytics destinations, and campaign delivery integrations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
