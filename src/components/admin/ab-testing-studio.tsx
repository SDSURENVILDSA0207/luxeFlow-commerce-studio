"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { seedAbTests } from "@/modules/experiments/seed-tests";
import type { AbTestRecord, AbTestStatus, AbTestType } from "@/modules/experiments/types";

const testTypes: Array<{ value: AbTestType; label: string }> = [
  { value: "homepage-hero", label: "Homepage Hero" },
  { value: "campaign-banner", label: "Campaign Banner" },
  { value: "cta-copy", label: "CTA Copy" },
  { value: "promotional-headline", label: "Promotional Headline" }
];

const statusOptions: AbTestStatus[] = ["draft", "running", "completed"];

function statusBadgeClass(status: AbTestStatus) {
  const map: Record<AbTestStatus, string> = {
    draft: "border-[#ead9bf] bg-[#fff6e9] text-[#926634]",
    running: "border-[#c9dbf2] bg-[#edf5ff] text-[#3f638f]",
    completed: "border-[#bdd8c3] bg-[#e9f6ec] text-[#2f6b3b]"
  };
  return map[status];
}

function createAbTest(): AbTestRecord {
  const id = `ab-test-${Date.now()}`;
  return {
    id,
    name: "Draft A/B Test",
    type: "homepage-hero",
    status: "draft",
    targetPage: "/",
    variantALabel: "Variant A",
    variantACopy: "Current control copy.",
    variantBLabel: "Variant B",
    variantBCopy: "New challenger copy.",
    metricsA: { impressions: 0, clicks: 0, ctr: "0.00%", conversionRate: "0.00%" },
    metricsB: { impressions: 0, clicks: 0, ctr: "0.00%", conversionRate: "0.00%" },
    updatedAt: new Date().toISOString()
  };
}

export function AbTestingStudio() {
  const [tests, setTests] = useState<AbTestRecord[]>(seedAbTests);
  const [selectedId, setSelectedId] = useState(seedAbTests[0]?.id ?? "");

  const selectedTest = useMemo(() => tests.find((test) => test.id === selectedId) ?? tests[0] ?? null, [tests, selectedId]);

  function updateTest(patch: Partial<AbTestRecord>) {
    if (!selectedTest) return;

    setTests((current) =>
      current.map((test) =>
        test.id === selectedTest.id
          ? {
              ...test,
              ...patch,
              updatedAt: new Date().toISOString()
            }
          : test
      )
    );
  }

  function addTest() {
    const newTest = createAbTest();
    setTests((current) => [newTest, ...current]);
    setSelectedId(newTest.id);
  }

  if (!selectedTest) return null;

  const winner =
    Number.parseFloat(selectedTest.metricsA.conversionRate) > Number.parseFloat(selectedTest.metricsB.conversionRate)
      ? selectedTest.variantALabel
      : selectedTest.variantBLabel;

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
      <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">A/B Tests</p>
              <h2 className="mt-1 font-display text-heading-lg text-[#2d2319]">Experiment List</h2>
            </div>
            <Button size="sm" onClick={addTest}>
              New Test
            </Button>
          </div>

          <div className="space-y-2">
            {tests.map((test) => (
              <button
                key={test.id}
                type="button"
                onClick={() => setSelectedId(test.id)}
                className={`premium-ring w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  selectedTest.id === test.id
                    ? "border-[#d5b98f] bg-[#fff9f0]"
                    : "border-[#eadfce] bg-[#fcfaf7] hover:border-[#dfd1bc]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{test.name}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusBadgeClass(test.status)}`}>
                    {test.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[#8a7b69]">{testTypes.find((item) => item.value === test.type)?.label}</p>
                <p className="mt-2 line-clamp-2 text-body-sm text-[#7b6d5b]">{test.targetPage}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(22,18,12,0.06)]">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Create / Edit</p>
                <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">A/B Test Setup</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${statusBadgeClass(selectedTest.status)}`}>
                {selectedTest.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Test Name</span>
                <input
                  value={selectedTest.name}
                  onChange={(event) => updateTest({ name: event.target.value })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Test Type</span>
                <select
                  value={selectedTest.type}
                  onChange={(event) => updateTest({ type: event.target.value as AbTestType })}
                  className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                >
                  {testTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Target Page</span>
              <input
                value={selectedTest.targetPage}
                onChange={(event) => updateTest({ targetPage: event.target.value })}
                className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Variant A Label</span>
                  <input
                    value={selectedTest.variantALabel}
                    onChange={(event) => updateTest({ variantALabel: event.target.value })}
                    className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Variant A Copy</span>
                  <textarea
                    rows={4}
                    value={selectedTest.variantACopy}
                    onChange={(event) => updateTest({ variantACopy: event.target.value })}
                    className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
                  />
                </label>
              </div>

              <div className="space-y-2 rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Variant B Label</span>
                  <input
                    value={selectedTest.variantBLabel}
                    onChange={(event) => updateTest({ variantBLabel: event.target.value })}
                    className="premium-ring h-10 w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 text-body-sm text-[#32271c]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f7250]">Variant B Copy</span>
                  <textarea
                    rows={4}
                    value={selectedTest.variantBCopy}
                    onChange={(event) => updateTest({ variantBCopy: event.target.value })}
                    className="premium-ring w-full rounded-lg border border-[#ddcfbc] bg-[#fffdf9] px-3 py-2 text-body-sm text-[#32271c]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={selectedTest.status === status ? "primary" : "secondary"}
                  onClick={() => updateTest({ status })}
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9b7b4b]">Results View</p>
              <h3 className="mt-1 font-display text-heading-lg text-[#2d2319]">Mock Performance Metrics</h3>
            </div>

            {[selectedTest.metricsA, selectedTest.metricsB].map((metrics, index) => {
              const label = index === 0 ? selectedTest.variantALabel : selectedTest.variantBLabel;
              return (
                <div key={label} className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] p-4">
                  <p className="text-body-sm font-semibold text-[#352a1e]">{label}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-body-sm">
                    <div className="rounded-lg border border-[#e8dccd] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#8a7b69]">Impressions</p>
                      <p className="mt-1 font-semibold text-[#352a1e]">{metrics.impressions.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-[#e8dccd] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#8a7b69]">Clicks</p>
                      <p className="mt-1 font-semibold text-[#352a1e]">{metrics.clicks.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-[#e8dccd] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#8a7b69]">CTR</p>
                      <p className="mt-1 font-semibold text-[#352a1e]">{metrics.ctr}</p>
                    </div>
                    <div className="rounded-lg border border-[#e8dccd] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#8a7b69]">Conversion Rate</p>
                      <p className="mt-1 font-semibold text-[#352a1e]">{metrics.conversionRate}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="rounded-xl border border-[#d8c8b2] bg-[#fff5e8] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f6c41]">Current Winner</p>
              <p className="mt-1 text-body-sm font-semibold text-[#4a3521]">{winner}</p>
              <p className="mt-2 text-[12px] text-[#8a7b69]">
                Updated: {new Date(selectedTest.updatedAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
