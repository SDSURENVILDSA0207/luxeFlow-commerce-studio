"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";

function canUseDom() {
  return typeof document !== "undefined";
}
import { JewelryAdminBrandMark, StudioBrandMark } from "@/components/brand/brand-marks";
import { GlobalSearchPalette } from "@/components/search";
import { getStudioRouteMeta } from "@/components/layouts/studio-navigation";
import { cn } from "@/lib/utils/cn";

type StudioTopbarProps = {
  onToggleMenu: () => void;
};

export function StudioTopbar({ onToggleMenu }: StudioTopbarProps) {
  const pathname = usePathname();
  const routeMeta = getStudioRouteMeta(pathname);
  const [atelierOpen, setAtelierOpen] = useState(false);
  const atelierTitleId = useId();
  const atelierDismissRef = useRef<HTMLButtonElement>(null);

  const closeAtelier = useCallback(() => setAtelierOpen(false), []);

  useEffect(() => {
    if (!atelierOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAtelier();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => atelierDismissRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [atelierOpen, closeAtelier]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7dfd3] bg-[#f9f5ee]/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-8">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            className="premium-ring inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[#dfd3c4] bg-white text-[#4c3f30] transition-[background-color,transform] duration-200 active:scale-95 motion-reduce:active:scale-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
            <StudioBrandMark className="mt-0.5 h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Studio</p>
              <h1 className="mt-1 truncate font-display text-heading-lg text-[#281f17] sm:text-heading-xl">{routeMeta.title}</h1>
              <p className="mt-1 line-clamp-2 text-body-sm text-[#857765]">{routeMeta.description}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:min-w-[min(100%,24rem)] lg:max-w-xl xl:max-w-2xl">
          <GlobalSearchPalette
            variant="studio"
            className="w-full min-w-0 sm:min-w-[16rem] sm:flex-1 lg:max-w-md xl:max-w-lg"
          />
          <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
            <Link
              href={"/" as Route}
              className="premium-ring inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-[#e0d3c3] bg-white px-3 py-1.5 text-body-sm text-[#6f6151] transition-colors duration-200 hover:border-[#c9a66b] hover:text-[#4c3f30] active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto sm:shrink-0 sm:justify-start sm:whitespace-nowrap"
            >
              View storefront
            </Link>
            <Link
              href={"/admin/login" as Route}
              className="premium-ring inline-flex min-h-10 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-[#e0d3c3] bg-white px-3 py-1.5 text-body-sm font-medium text-[#6f6151] transition-colors duration-200 hover:border-[#c9a66b] hover:text-[#4c3f30] sm:w-auto sm:shrink-0"
              title="Jewelry Admin — sign in required"
            >
              <JewelryAdminBrandMark className="h-5 w-5" />
              <span className="whitespace-nowrap">Jewelry Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setAtelierOpen(true)}
              className="premium-ring inline-flex min-h-10 w-full min-w-0 cursor-pointer touch-manipulation items-center justify-center rounded-full border border-[#e0d3c3] bg-white px-3 py-2 text-center text-body-sm leading-snug text-[#6f6151] transition-[border-color,box-shadow,transform] duration-200 hover:border-[#c9a66b] hover:shadow-[0_0_0_3px_rgba(201,166,107,0.12)] active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto sm:min-h-10 sm:justify-start sm:px-3.5 sm:py-1.5 sm:text-left sm:leading-normal"
              title="Tap for a surprise — your session stays private in this browser."
              aria-haspopup="dialog"
              aria-expanded={atelierOpen}
              aria-controls={atelierOpen ? "studio-atelier-reveal" : undefined}
            >
              <span className="block w-full min-w-0 sm:hidden">
                <span className="block text-[0.8125rem] font-medium text-[#5c4f42]">Demo workspace</span>
                <span className="mt-0.5 block text-[0.7rem] text-[#857765]">Session-only changes</span>
              </span>
              <span className="hidden sm:inline sm:whitespace-nowrap">Demo workspace</span>
            </button>
          </div>
        </div>
      </div>

      {atelierOpen && canUseDom()
        ? createPortal(
            <div
              id="studio-atelier-reveal"
              className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-[#1a1510]/55 p-4 backdrop-blur-[6px] motion-safe:animate-atelier-backdrop-in motion-reduce:opacity-100 sm:items-center sm:p-6"
              role="presentation"
              onClick={closeAtelier}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={atelierTitleId}
                className={cn(
                  "relative my-4 w-full max-w-md overflow-hidden rounded-2xl border border-[#c9a66b]/45 bg-gradient-to-b from-[#fdfbf7] to-[#f3ebe0] p-6 shadow-[0_32px_80px_-20px_rgba(26,21,16,0.45)] motion-safe:animate-atelier-card-in motion-reduce:opacity-100 sm:p-8"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#c9a66b]/25 blur-2xl motion-reduce:hidden"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-[120%] -translate-x-1/2 bg-gradient-to-t from-[#c9a66b]/12 to-transparent motion-reduce:hidden"
                  aria-hidden
                />
                <div className="flex max-h-[calc(100vh-3.5rem)] flex-col sm:max-h-[calc(100vh-5.5rem)]">
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9b7b4b]">LuxeFlow Studio</p>
                    <h2 id={atelierTitleId} className="mt-3 font-display text-2xl font-normal leading-tight tracking-[-0.02em] text-[#281f17]">
                      You&apos;ve stepped into the private atelier.
                    </h2>
                    <p className="mt-4 text-body-sm leading-relaxed text-[#6f6151]">
                      This demo workspace keeps every tweak in your browser—your rehearsal hall, not the showroom floor.
                      Nothing leaves until you do.
                    </p>
                    <p className="mt-5 text-[12px] italic text-[#9b7b4b]">Go on—your next edit is already waiting.</p>
                  </div>
                  <div className="shrink-0 pt-6 sm:pt-8">
                    <button
                      ref={atelierDismissRef}
                      type="button"
                      onClick={closeAtelier}
                      className="flex min-h-[3rem] w-full items-center justify-center rounded-xl border-2 border-[#c9a66b] bg-[#281f17] px-4 py-3 text-body-sm font-semibold text-[#fdfbf7] shadow-[0_14px_30px_-16px_rgba(26,21,16,0.8),inset_0_1px_0_rgba(255,255,255,0.22)] transition-[filter,box-shadow,transform] duration-200 hover:brightness-[1.05] hover:shadow-[0_18px_34px_-16px_rgba(26,21,16,0.9),inset_0_1px_0_rgba(255,255,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a66b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf7] active:scale-[0.99] motion-reduce:active:scale-100"
                    >
                      Back to work
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
