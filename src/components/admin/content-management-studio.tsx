"use client";

import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { adminNativeSelectClassName } from "@/components/ui/dropdown-panel";
import { resolveUserFacingHref } from "@/lib/navigation/resolve-user-facing-href";
import { seedContentBlocks } from "@/modules/cms/seed-content-blocks";
import type { ContentBlock, ContentBlockType, ContentStatus } from "@/modules/cms/types";

const typeLabelMap: Record<ContentBlockType, string> = {
  "homepage-hero": "Homepage Hero",
  "promotional-banner": "Promotional Banner",
  "featured-collection": "Featured Collection",
  "cta-section": "CTA Section",
  "landing-section": "Landing Section"
};

function statusBadgeClass(status: ContentStatus) {
  return status === "published"
    ? "border-[#bdd8c3] bg-[#e9f6ec] text-[#2f6b3b]"
    : "border-[#ead9bf] bg-[#fff5e4] text-[#926634]";
}

function getNewBlock(): ContentBlock {
  const now = new Date();
  return {
    id: `block-${now.getTime()}`,
    name: "Draft Content Block",
    type: "landing-section",
    status: "draft",
    page: "/c/new-arrivals-collection",
    headline: "New campaign headline",
    body: "Add section narrative, merchandising angle, and offer messaging.",
    badgeText: "New Block",
    ctaLabel: "Learn More",
    ctaUrl: "/collections",
    updatedAt: now.toISOString()
  };
}

export function ContentManagementStudio() {
  const [blocks, setBlocks] = useState<ContentBlock[]>(seedContentBlocks);
  const [selectedId, setSelectedId] = useState(seedContentBlocks[0]?.id ?? "");

  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedId) ?? blocks[0] ?? null,
    [blocks, selectedId]
  );

  function patchSelectedBlock(patch: Partial<ContentBlock>) {
    if (!selectedBlock) return;

    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === selectedBlock.id
          ? {
              ...block,
              ...patch,
              updatedAt: new Date().toISOString()
            }
          : block
      )
    );
  }

  function createBlock() {
    const newBlock = getNewBlock();
    setBlocks((current) => [newBlock, ...current]);
    setSelectedId(newBlock.id);
  }

  function publishSelected() {
    patchSelectedBlock({ status: "published" });
  }

  if (!selectedBlock) {
    return (
      <Card className="border-[#e7dfd3] bg-white">
        <CardContent className="p-6">
          <p className="text-body-sm text-[#7a6e5f]">No content blocks available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div id="content-blocks" className="grid gap-5 xl:grid-cols-[23rem_1fr]">
      <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Content Blocks</p>
              <h2 className="mt-1 font-display text-heading-lg text-[#2d2319]">CMS List</h2>
            </div>
            <Button size="sm" onClick={createBlock}>
              New Block
            </Button>
          </div>

          <div className="space-y-2">
            {blocks.map((block) => (
              <button
                type="button"
                key={block.id}
                onClick={() => setSelectedId(block.id)}
                className={`premium-ring w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  selectedBlock.id === block.id
                    ? "border-[#d5b98f] bg-[#fff9f0]"
                    : "border-[#eadfce] bg-[#fcfaf7] hover:border-[#dfd1bc]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{block.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(block.status)}`}>
                    {block.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[#8a7b69]">{typeLabelMap[block.type]}</p>
                <p className="mt-2 line-clamp-2 text-body-sm text-[#7b6d5b]">{block.headline}</p>
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Editor</p>
                <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Edit Content Block</h3>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${statusBadgeClass(selectedBlock.status)}`}>
                  {selectedBlock.status}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0 whitespace-nowrap !border !border-solid !border-[#ddcfbc] !bg-[#fffdf9] !text-[#1f1810] shadow-sm hover:!border-[#c9a66b] hover:!bg-white hover:!text-[#16130e] active:translate-y-px"
                  onClick={() => patchSelectedBlock({ status: "draft" })}
                >
                  Save Draft
                </Button>
                <Button size="sm" className="shrink-0 whitespace-nowrap" onClick={publishSelected}>
                  Publish
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Block Name</span>
                <input
                  value={selectedBlock.name}
                  onChange={(event) => patchSelectedBlock({ name: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Page Route</span>
                <input
                  value={selectedBlock.page}
                  onChange={(event) => patchSelectedBlock({ page: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Type</span>
                <select
                  value={selectedBlock.type}
                  onChange={(event) => patchSelectedBlock({ type: event.target.value as ContentBlockType })}
                  className={adminNativeSelectClassName}
                >
                  {Object.entries(typeLabelMap).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Badge Label</span>
                <input
                  value={selectedBlock.badgeText}
                  onChange={(event) => patchSelectedBlock({ badgeText: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Headline</span>
              <input
                value={selectedBlock.headline}
                onChange={(event) => patchSelectedBlock({ headline: event.target.value })}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Body Copy</span>
              <textarea
                value={selectedBlock.body}
                onChange={(event) => patchSelectedBlock({ body: event.target.value })}
                rows={5}
                className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">CTA Label</span>
                <input
                  value={selectedBlock.ctaLabel}
                  onChange={(event) => patchSelectedBlock({ ctaLabel: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">CTA URL</span>
                <input
                  value={selectedBlock.ctaUrl}
                  onChange={(event) => patchSelectedBlock({ ctaUrl: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
            </div>

            <p className="text-[12px] text-[#8a7b69]">Last updated: {new Date(selectedBlock.updatedAt).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Preview</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Live Section Preview</h3>
            </div>

            <section className="rounded-2xl border border-[#e4d6c3] bg-gradient-to-br from-[#fff9f2] to-[#f7efe4] p-5">
              <p className="inline-flex rounded-full border border-[#e1ccae] bg-[#fdf3e3] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f6c41]">
                {selectedBlock.badgeText || "Campaign Block"}
              </p>
              <h4 className="mt-3 font-display text-heading-xl text-[#2f251b]">{selectedBlock.headline || "Section headline"}</h4>
              <p className="mt-2 text-body-sm text-[#6f6151]">
                {selectedBlock.body || "Section description preview. Add clear value messaging for the campaign or storefront."}
              </p>
              {(() => {
                const previewHref = resolveUserFacingHref(selectedBlock.ctaUrl);
                const isExternal = /^(https?:|mailto:|tel:)/i.test(previewHref);
                const ctaClass =
                  "mt-4 inline-flex h-10 items-center rounded-lg border border-transparent bg-[#caa774] px-4 text-body-sm font-semibold text-[#24170d] transition-opacity hover:opacity-95";
                const label = selectedBlock.ctaLabel || "Call to action";
                if (isExternal) {
                  return (
                    <a
                      href={previewHref}
                      className={ctaClass}
                      {...(previewHref.startsWith("http")
                        ? { target: "_blank" as const, rel: "noopener noreferrer" }
                        : {})}
                    >
                      {label}
                    </a>
                  );
                }
                return (
                  <Link href={previewHref as Route} className={ctaClass}>
                    {label}
                  </Link>
                );
              })()}
            </section>

            <div className="rounded-xl border border-[#ebe0d2] bg-[#fcf8f2] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Placement</p>
              <p className="mt-2 text-body-sm text-[#6f6151]">
                {typeLabelMap[selectedBlock.type]} on <span className="font-semibold text-[#3a2e22]">{selectedBlock.page}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
