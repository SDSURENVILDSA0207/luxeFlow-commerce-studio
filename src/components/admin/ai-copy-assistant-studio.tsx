"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import type { AICopySuggestions } from "@/modules/ai-assistant/types";

type SuggestionGroupKey =
  | "heroHeadlines"
  | "ctaSuggestions"
  | "promoBannerText"
  | "emailSubjectLines"
  | "campaignSummaries";

const groupLabelMap: Record<SuggestionGroupKey, string> = {
  heroHeadlines: "Hero Headline Suggestions",
  ctaSuggestions: "CTA Suggestions",
  promoBannerText: "Promo Banner Suggestions",
  emailSubjectLines: "Email Subject Line Suggestions",
  campaignSummaries: "Campaign Summary Suggestions"
};

const emptySuggestions: AICopySuggestions = {
  heroHeadlines: [],
  ctaSuggestions: [],
  promoBannerText: [],
  emailSubjectLines: [],
  campaignSummaries: []
};

export function AICopyAssistantStudio() {
  const [campaignTheme, setCampaignTheme] = useState("Spring Bridal Event");
  const [audience, setAudience] = useState("High-intent bridal shoppers");
  const [promotionType, setPromotionType] = useState("Limited seasonal offer");
  const [tone, setTone] = useState("luxury-modern");

  const [suggestions, setSuggestions] = useState<AICopySuggestions>(emptySuggestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLine, setCopiedLine] = useState<string | null>(null);

  const [editorHero, setEditorHero] = useState("");
  const [editorCta, setEditorCta] = useState("");
  const [editorBanner, setEditorBanner] = useState("");
  const [editorSubject, setEditorSubject] = useState("");
  const [editorSummary, setEditorSummary] = useState("");

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/ai-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignTheme, audience, promotionType, tone })
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        setError(json?.error?.message ?? "Unable to generate suggestions.");
        return;
      }

      setSuggestions(json.data);
    } catch {
      setError("Unable to generate suggestions right now.");
    } finally {
      setIsLoading(false);
    }
  }

  function applyToEditor(group: SuggestionGroupKey, value: string) {
    if (group === "heroHeadlines") setEditorHero(value);
    if (group === "ctaSuggestions") setEditorCta(value);
    if (group === "promoBannerText") setEditorBanner(value);
    if (group === "emailSubjectLines") setEditorSubject(value);
    if (group === "campaignSummaries") setEditorSummary(value);
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLine(value);
      window.setTimeout(() => {
        setCopiedLine((current) => (current === value ? null : current));
      }, 2000);
    } catch {
      // Silent fallback: keep UX simple even if clipboard is blocked.
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[23rem_1fr]">
      <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
        <CardContent className="space-y-4 p-5" aria-busy={isLoading}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Context Input</p>
            <h2 className="mt-1 font-display text-heading-lg text-[#2d2319]">AI Copy Assistant</h2>
            <p className="mt-1 text-body-sm text-[#7b6d5b]">Generate premium marketing copy suggestions from campaign context.</p>
          </div>

          <label className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Campaign Theme</span>
            <input
              value={campaignTheme}
              disabled={isLoading}
              onChange={(event) => setCampaignTheme(event.target.value)}
              className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c] disabled:cursor-not-allowed disabled:opacity-55"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Audience</span>
            <input
              value={audience}
              disabled={isLoading}
              onChange={(event) => setAudience(event.target.value)}
              className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c] disabled:cursor-not-allowed disabled:opacity-55"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Promotion Type</span>
            <input
              value={promotionType}
              disabled={isLoading}
              onChange={(event) => setPromotionType(event.target.value)}
              className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c] disabled:cursor-not-allowed disabled:opacity-55"
            />
          </label>

          <label className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Tone</span>
            <input
              value={tone}
              disabled={isLoading}
              onChange={(event) => setTone(event.target.value)}
              className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c] disabled:cursor-not-allowed disabled:opacity-55"
            />
          </label>

          <Button type="button" onClick={handleGenerate} disabled={isLoading} aria-busy={isLoading} className="w-full">
            {isLoading ? "Generating…" : "Generate Suggestions"}
          </Button>

          {error ? <p className="text-body-sm text-[#9b5757]">{error}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Suggestions</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Generated Copy Options</h3>
            </div>

            {(Object.keys(groupLabelMap) as SuggestionGroupKey[]).map((group) => (
              <div key={group} className="space-y-2 rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                <p className="text-body-sm font-semibold text-[#352a1e]">{groupLabelMap[group]}</p>
                {suggestions[group].length === 0 ? (
                  <p className="text-body-sm text-[#8a7b69]">No suggestions yet. Generate to begin.</p>
                ) : (
                  suggestions[group].map((text) => (
                    <div key={text} className="rounded-lg border border-[#e5d8c8] bg-white p-3">
                      <p className="text-body-sm text-[#5f5243]">{text}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="secondary" type="button" onClick={() => copyText(text)}>
                          {copiedLine === text ? "Copied" : "Copy"}
                        </Button>
                        <Button size="sm" type="button" onClick={() => applyToEditor(group, text)}>
                          Apply to Editor
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Editor Draft</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Copy-to-Editor Workflow</h3>
            </div>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Hero Headline</span>
              <input
                value={editorHero}
                onChange={(event) => setEditorHero(event.target.value)}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">CTA Copy</span>
              <input
                value={editorCta}
                onChange={(event) => setEditorCta(event.target.value)}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Promo Banner Text</span>
              <textarea
                rows={3}
                value={editorBanner}
                onChange={(event) => setEditorBanner(event.target.value)}
                className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Email Subject Line</span>
              <input
                value={editorSubject}
                onChange={(event) => setEditorSubject(event.target.value)}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Campaign Summary</span>
              <textarea
                rows={4}
                value={editorSummary}
                onChange={(event) => setEditorSummary(event.target.value)}
                className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
