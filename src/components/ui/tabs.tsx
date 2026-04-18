"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
  "aria-label"?: string;
};

export function Tabs({ items, defaultTabId, "aria-label": ariaLabel = "Sections" }: TabsProps) {
  const initialTab = useMemo(() => defaultTabId ?? items[0]?.id ?? "", [defaultTabId, items]);
  const [activeTab, setActiveTab] = useState(initialTab);

  const currentTab = items.find((item) => item.id === activeTab) ?? items[0];
  if (!currentTab) return null;

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const idx = items.findIndex((item) => item.id === activeTab);
    if (idx < 0) return;
    if (event.key === "Home") {
      setActiveTab(items[0]!.id);
      return;
    }
    if (event.key === "End") {
      setActiveTab(items[items.length - 1]!.id);
      return;
    }
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (idx + delta + items.length) % items.length;
    setActiveTab(items[next]!.id);
  }

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onTabListKeyDown}
        className="flex min-w-0 max-w-full flex-wrap gap-1 rounded-xl border border-border bg-surface-2 p-1"
      >
        {items.map((item) => {
          const selected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "premium-ring min-w-0 rounded-lg px-3 py-2 text-left text-body-sm transition-all duration-200 ease-premium sm:px-4",
                selected ? "bg-surface text-foreground shadow-premium-soft" : "text-muted hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        id={`panel-${currentTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentTab.id}`}
        tabIndex={0}
        className="premium-panel min-w-0 p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {currentTab.content}
      </div>
    </div>
  );
}
