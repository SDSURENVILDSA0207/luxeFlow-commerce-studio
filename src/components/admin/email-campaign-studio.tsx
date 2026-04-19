"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { adminNativeSelectClassName } from "@/components/ui/dropdown-panel";
import { seedEmailCampaigns } from "@/modules/email/seed-campaigns";
import type {
  EmailCampaignRecord,
  EmailCampaignStatus,
  EmailTemplate,
  EmailTemplateId
} from "@/modules/email/types";

type Viewport = "desktop" | "mobile";

type EmailCampaignStudioProps = {
  templates: EmailTemplate[];
};

const audienceSegments = [
  "All Subscribers",
  "VIP Bridal Leads",
  "High Intent Repeat Customers",
  "Newsletter Early Access",
  "Holiday Gift Buyers"
];

const campaignStatuses: EmailCampaignStatus[] = ["draft", "scheduled", "sent"];

function statusBadgeClass(status: EmailCampaignStatus) {
  const map: Record<EmailCampaignStatus, string> = {
    draft: "border-[#ead9bf] bg-[#fff6e9] text-[#926634]",
    scheduled: "border-[#c9dbf2] bg-[#edf5ff] text-[#3f638f]",
    sent: "border-[#bdd8c3] bg-[#e9f6ec] text-[#2f6b3b]"
  };
  return map[status];
}

function makeCampaignFromTemplate(template: EmailTemplate): EmailCampaignRecord {
  const id = `email-campaign-${Date.now()}`;
  const nextDay = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const sendDateTime = nextDay.toISOString().slice(0, 16);

  return {
    id,
    name: `${template.name} Campaign`,
    templateId: template.id,
    subject: template.subject,
    sendDateTime,
    audienceSegment: "All Subscribers",
    status: "draft",
    updatedAt: new Date().toISOString()
  };
}

export function EmailCampaignStudio({ templates }: EmailCampaignStudioProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<EmailTemplateId>(templates[0].id);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [campaigns, setCampaigns] = useState<EmailCampaignRecord[]>(seedEmailCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState(seedEmailCampaigns[0]?.id ?? "");

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId, templates]
  );

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0] ?? null,
    [campaigns, selectedCampaignId]
  );

  function updateCampaign(patch: Partial<EmailCampaignRecord>) {
    if (!selectedCampaign) return;

    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === selectedCampaign.id
          ? {
              ...campaign,
              ...patch,
              updatedAt: new Date().toISOString()
            }
          : campaign
      )
    );
  }

  function createCampaignFromTemplate() {
    const newCampaign = makeCampaignFromTemplate(selectedTemplate);
    setCampaigns((current) => [newCampaign, ...current]);
    setSelectedCampaignId(newCampaign.id);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <Card className="h-fit border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardHeader>
            <CardTitle className="text-heading-lg text-[#2f251b]">Email Templates</CardTitle>
            <CardDescription className="text-[#7c6d5d]">
              Choose a template, preview it, then create a campaign with one click.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`premium-ring w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                    selectedTemplateId === template.id
                      ? "border-[#d5b98f] bg-[#fff9f0]"
                      : "border-[#eadfce] bg-[#fcfaf7] hover:border-[#dfd1bc]"
                  }`}
                >
                  <p className="text-body-sm font-semibold text-[#352a1e]">{template.name}</p>
                  <p className="mt-1 text-body-sm text-[#7b6d5b]">{template.description}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-[#efe5d8] pt-4">
              <Button size="sm" variant={viewport === "desktop" ? "primary" : "secondary"} onClick={() => setViewport("desktop")}>
                Desktop
              </Button>
              <Button size="sm" variant={viewport === "mobile" ? "primary" : "secondary"} onClick={() => setViewport("mobile")}>
                Mobile
              </Button>
              <Button size="sm" onClick={createCampaignFromTemplate}>
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
            <CardContent className="flex flex-wrap items-center gap-3 p-5">
              <span className="rounded-full border border-[#dcc09a] bg-[#fef3e4] px-3 py-1 text-[11px] font-semibold uppercase text-[#8b673d]">
                {selectedTemplate.name}
              </span>
              <p className="text-body-sm text-[#6f6151]">
                <span className="font-semibold text-[#352a1e]">Subject:</span> {selectedTemplate.subject}
              </p>
              <p className="text-body-sm text-[#6f6151]">
                <span className="font-semibold text-[#352a1e]">Preheader:</span> {selectedTemplate.preheader}
              </p>
            </CardContent>
          </Card>

          <div
            className={`mx-auto rounded-2xl border border-[#d9ccbb] bg-[#efe6d9] p-4 shadow-[0_12px_30px_rgba(20,18,23,0.1)] ${
              viewport === "desktop" ? "max-w-[760px]" : "max-w-[390px]"
            }`}
          >
            <iframe
              title={`${selectedTemplate.name} preview`}
              srcDoc={selectedTemplate.html}
              className={`w-full rounded-xl border border-[#d8cbbb] bg-white ${
                viewport === "desktop" ? "h-[820px]" : "h-[760px]"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardHeader>
            <CardTitle className="text-heading-lg text-[#2f251b]">Email Campaigns</CardTitle>
            <CardDescription className="text-[#7c6d5d]">Draft, schedule, and monitor send-ready campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => setSelectedCampaignId(campaign.id)}
                className={`premium-ring w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  selectedCampaign?.id === campaign.id
                    ? "border-[#d5b98f] bg-[#fff9f0]"
                    : "border-[#eadfce] bg-[#fcfaf7] hover:border-[#dfd1bc]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{campaign.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-[#8a7b69]">{campaign.audienceSegment}</p>
                <p className="mt-1 text-body-sm text-[#7b6d5b]">{campaign.subject}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedCampaign ? (
          <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Campaign Editor</p>
                  <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Create / Edit Email Campaign</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${statusBadgeClass(selectedCampaign.status)}`}>
                  {selectedCampaign.status}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Campaign Name</span>
                  <input
                    value={selectedCampaign.name}
                    onChange={(event) => updateCampaign({ name: event.target.value })}
                    className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Template</span>
                  <select
                    value={selectedCampaign.templateId}
                    onChange={(event) => updateCampaign({ templateId: event.target.value as EmailTemplateId })}
                    className={adminNativeSelectClassName}
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Subject Line</span>
                <input
                  value={selectedCampaign.subject}
                  onChange={(event) => updateCampaign({ subject: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Send Date / Time</span>
                  <input
                    type="datetime-local"
                    value={selectedCampaign.sendDateTime}
                    onChange={(event) => updateCampaign({ sendDateTime: event.target.value })}
                    className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Audience Segment</span>
                  <select
                    value={selectedCampaign.audienceSegment}
                    onChange={(event) => updateCampaign({ audienceSegment: event.target.value })}
                    className={adminNativeSelectClassName}
                  >
                    {audienceSegments.map((segment) => (
                      <option key={segment} value={segment}>
                        {segment}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {campaignStatuses.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedCampaign.status === status ? "primary" : "secondary"}
                    onClick={() => updateCampaign({ status })}
                  >
                    Mark {status}
                  </Button>
                ))}
              </div>

              <div className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4 text-body-sm text-[#6f6151]">
                <p>
                  <span className="font-semibold text-[#352a1e]">Template:</span> {selectedCampaign.templateId}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-[#352a1e]">Audience:</span> {selectedCampaign.audienceSegment}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-[#352a1e]">Scheduled Send:</span> {selectedCampaign.sendDateTime}
                </p>
                <p className="mt-1 text-[12px] text-[#8a7b69]">
                  Last updated: {new Date(selectedCampaign.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
