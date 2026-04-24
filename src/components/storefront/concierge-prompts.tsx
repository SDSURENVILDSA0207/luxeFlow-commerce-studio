"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { dropdownPanelClassName } from "@/components/ui/dropdown-panel";
import { conciergeQuickActions } from "@/lib/storefront/storefront-routes";
import { cn } from "@/lib/utils/cn";

export function ConciergePrompts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[55] flex flex-col items-end gap-3 sm:right-6">
      {open ? (
        <div
          id="concierge-panel"
          className={cn(
            "pointer-events-auto w-[min(calc(100vw-2rem),20rem)] p-4",
            dropdownPanelClassName
          )}
          role="dialog"
          aria-label="Styling quick actions"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-soft">Styling</p>
          <p className="mt-1 text-body-sm text-muted">Jump to a destination or reach the studio—same paths as our main navigation.</p>
          <ul className="mt-3 space-y-2">
            {conciergeQuickActions.map((action) => {
              if ("external" in action && action.external) {
                return (
                  <li key={action.label}>
                    <a
                      href={action.href}
                      className="premium-ring block rounded-[0.375rem] border border-border/60 bg-surface-2/80 px-3 py-2.5 text-body-sm text-foreground transition-colors duration-150 hover:border-border-strong hover:bg-surface-3 hover:text-foreground"
                      rel="noopener noreferrer"
                    >
                      {action.label}
                    </a>
                  </li>
                );
              }
              return (
                <li key={action.label}>
                  <Link
                    href={action.href as Route}
                    className="premium-ring block rounded-[0.375rem] border border-border/60 bg-surface-2/80 px-3 py-2.5 text-body-sm text-foreground transition-colors duration-150 hover:border-border-strong hover:bg-surface-3 hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {action.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pointer-events-auto premium-ring flex h-12 min-h-12 items-center gap-2 rounded-full border border-accent/50 bg-accent px-5 text-body-sm font-semibold text-accent-foreground shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-200 hover:bg-accent-soft hover:shadow-[0_6px_28px_rgba(0,0,0,0.4)] active:scale-[0.98] motion-reduce:transform-none"
        )}
        aria-expanded={open}
        aria-controls="concierge-panel"
        id="concierge-trigger"
      >
        <span aria-hidden>✦</span>
        Styling
      </button>
    </div>
  );
}
