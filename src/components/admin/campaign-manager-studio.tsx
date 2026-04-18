"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { seedCampaigns } from "@/modules/campaigns/seed-campaigns";
import type { CampaignRecord, CampaignStatus } from "@/modules/campaigns/types";

const statusOptions: CampaignStatus[] = ["draft", "scheduled", "active", "completed"];

const targetPageOptions = ["/", "/collections", "/products", "/c/spring-bridal-event", "/c/new-arrivals-collection"];
const bannerBlockOptions = ["block-promo-bridal", "block-featured-collection", "block-cta-newsletter"];
const contentBlockOptions = ["block-hero-home", "block-landing-story", "block-featured-collection"];
const emailTemplateOptions = ["promotional-sale", "featured-collection", "new-arrivals"];

function statusBadgeClass(status: CampaignStatus) {
  const map: Record<CampaignStatus, string> = {
    draft: "border-[#ead9bf] bg-[#fff6e9] text-[#926634]",
    scheduled: "border-[#c9dbf2] bg-[#edf5ff] text-[#3f638f]",
    active: "border-[#bdd8c3] bg-[#e9f6ec] text-[#2f6b3b]",
    completed: "border-[#d9d9dd] bg-[#f4f4f6] text-[#63636d]"
  };
  return map[status];
}

function createNewCampaign(): CampaignRecord {
  const id = `campaign-${Date.now()}`;
  return {
    id,
    name: "Draft Campaign",
    status: "draft",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    targetPage: "/collections",
    landingPage: "/c/new-arrivals-collection",
    bannerBlockId: bannerBlockOptions[0],
    contentBlockId: contentBlockOptions[0],
    emailTemplateId: emailTemplateOptions[0],
    summary: "Add campaign objective and channel strategy.",
    updatedAt: new Date().toISOString()
  };
}

export function CampaignManagerStudio() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(seedCampaigns);
  const [selectedId, setSelectedId] = useState(seedCampaigns[0]?.id ?? "");

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === selectedId) ?? campaigns[0] ?? null,
    [campaigns, selectedId]
  );

  function updateCampaign(patch: Partial<CampaignRecord>) {
    if (!selectedCampaign) return;

    setCampaigns((prev) =>
      prev.map((campaign) =>
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

  function addCampaign() {
    const campaign = createNewCampaign();
    setCampaigns((prev) => [campaign, ...prev]);
    setSelectedId(campaign.id);
  }

  if (!selectedCampaign) return null;

  return (
    <div className="grid gap-5 xl:grid-cols-[23rem_1fr]">
      <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Campaign List</p>
              <h2 className="mt-1 font-display text-heading-lg text-[#2d2319]">Promotions</h2>
            </div>
            <Button size="sm" onClick={addCampaign}>
              New Campaign
            </Button>
          </div>

          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => setSelectedId(campaign.id)}
                className={`premium-ring w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  selectedCampaign.id === campaign.id
                    ? "border-[#d5b98f] bg-[#fff9f0]"
                    : "border-[#eadfce] bg-[#fcfaf7] hover:border-[#dfd1bc]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{campaign.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-[#8a7b69]">
                  {campaign.startDate} to {campaign.endDate}
                </p>
                <p className="mt-1 line-clamp-2 text-body-sm text-[#7b6d5b]">{campaign.summary}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Campaign Form</p>
                <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Create / Edit Campaign</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${statusBadgeClass(selectedCampaign.status)}`}>
                {selectedCampaign.status}
              </span>
            </div>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Campaign Name</span>
              <input
                value={selectedCampaign.name}
                onChange={(event) => updateCampaign({ name: event.target.value })}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Start Date</span>
                <input
                  type="date"
                  value={selectedCampaign.startDate}
                  onChange={(event) => updateCampaign({ startDate: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">End Date</span>
                <input
                  type="date"
                  value={selectedCampaign.endDate}
                  onChange={(event) => updateCampaign({ endDate: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Target Page</span>
                <select
                  value={selectedCampaign.targetPage}
                  onChange={(event) => updateCampaign({ targetPage: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                >
                  {targetPageOptions.map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Landing Page</span>
                <input
                  value={selectedCampaign.landingPage}
                  onChange={(event) => updateCampaign({ landingPage: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Banner Block</span>
                <select
                  value={selectedCampaign.bannerBlockId}
                  onChange={(event) => updateCampaign({ bannerBlockId: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                >
                  {bannerBlockOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Content Block</span>
                <select
                  value={selectedCampaign.contentBlockId}
                  onChange={(event) => updateCampaign({ contentBlockId: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                >
                  {contentBlockOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Email Template</span>
                <select
                  value={selectedCampaign.emailTemplateId}
                  onChange={(event) => updateCampaign({ emailTemplateId: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                >
                  {emailTemplateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Campaign Summary</span>
              <textarea
                value={selectedCampaign.summary}
                onChange={(event) => updateCampaign({ summary: event.target.value })}
                rows={4}
                className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
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
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Campaign Detail</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Launch Summary</h3>
            </div>

            <div className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
              <p className="text-body-sm font-semibold text-[#352a1e]">{selectedCampaign.name}</p>
              <p className="mt-1 text-body-sm text-[#7b6d5b]">{selectedCampaign.summary}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(selectedCampaign.status)}`}>
                  {selectedCampaign.status}
                </span>
                <p className="text-[12px] text-[#8a7b69]">
                  {selectedCampaign.startDate} to {selectedCampaign.endDate}
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4 text-body-sm text-[#6f6151]">
              <p>
                <span className="font-semibold text-[#352a1e]">Target Page:</span> {selectedCampaign.targetPage}
              </p>
              <p>
                <span className="font-semibold text-[#352a1e]">Landing Page:</span> {selectedCampaign.landingPage}
              </p>
              <p>
                <span className="font-semibold text-[#352a1e]">Banner:</span> {selectedCampaign.bannerBlockId}
              </p>
              <p>
                <span className="font-semibold text-[#352a1e]">Content:</span> {selectedCampaign.contentBlockId}
              </p>
              <p>
                <span className="font-semibold text-[#352a1e]">Email Template:</span> {selectedCampaign.emailTemplateId}
              </p>
            </div>

            <p className="text-[12px] text-[#8a7b69]">Last updated: {new Date(selectedCampaign.updatedAt).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
