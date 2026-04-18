"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAdminRouteMeta } from "@/components/layouts/admin-navigation";

type AdminTopbarProps = {
  onToggleMenu: () => void;
};

export function AdminTopbar({ onToggleMenu }: AdminTopbarProps) {
  const pathname = usePathname();
  const routeMeta = getAdminRouteMeta(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7dfd3] bg-[#f9f5ee]/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            className="premium-ring inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg border border-[#dfd3c4] bg-white text-[#4c3f30] transition-[background-color,transform] duration-200 active:scale-95 motion-reduce:active:scale-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Studio</p>
            <h1 className="mt-1 truncate font-display text-heading-lg text-[#281f17] sm:text-heading-xl">{routeMeta.title}</h1>
            <p className="mt-1 line-clamp-2 text-body-sm text-[#857765]">{routeMeta.description}</p>
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={"/" as Route}
            className="premium-ring hidden touch-manipulation rounded-full border border-[#e0d3c3] bg-white px-3 py-1.5 text-body-sm text-[#6f6151] transition-colors duration-200 hover:border-[#c9a66b] hover:text-[#4c3f30] active:scale-[0.98] motion-reduce:active:scale-100 sm:inline-flex"
          >
            View storefront
          </Link>
          <span
            className="hidden max-w-[11rem] items-center truncate rounded-full border border-[#e0d3c3] bg-white px-3 py-1.5 text-center text-body-sm text-[#6f6151] md:inline-flex"
            title="Demo workspace — preferences and CMS changes stay in this browser session."
          >
            Demo workspace
          </span>
        </div>
      </div>
    </header>
  );
}
