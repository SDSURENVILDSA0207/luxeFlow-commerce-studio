"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { JewelryAdminBrandMark, StudioBrandMark } from "@/components/brand/brand-marks";
import { getInventoryAdminRouteMeta } from "@/lib/inventory-admin/navigation";
import { cn } from "@/lib/utils/cn";

type InventoryAdminTopbarProps = {
  onToggleMenu: () => void;
  mobileNavOpen: boolean;
};

export function InventoryAdminTopbar({ onToggleMenu, mobileNavOpen }: InventoryAdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const routeMeta = getInventoryAdminRouteMeta(pathname);
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/admin/logout", { method: "POST", credentials: "include" });
      router.replace("/admin/login" as Route);
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#cfd8dc] bg-white/95 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            className={cn(
              "inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-[#b0bec5] bg-white text-[#37474f] lg:hidden",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546e7a]"
            )}
            aria-expanded={mobileNavOpen}
            aria-controls="jewelry-admin-mobile-nav"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <JewelryAdminBrandMark className="mt-0.5 h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#607d8b]">Jewelry Admin</p>
              <h1 className="mt-0.5 truncate font-display text-xl text-[#263238] sm:text-2xl">{routeMeta.title}</h1>
              <p className="mt-1 line-clamp-2 text-sm text-[#546e7a]">{routeMeta.description}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href={"/studio" as Route}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#b0bec5] bg-white px-3 text-sm font-medium text-[#455a64] transition-colors hover:bg-[#eceff1]"
          >
            <StudioBrandMark className="h-5 w-5" />
            Studio
          </Link>
          <Link
            href={"/" as Route}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#b0bec5] bg-white px-3 text-sm font-medium text-[#455a64] transition-colors hover:bg-[#eceff1]"
          >
            Storefront
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#263238] px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          >
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </div>
    </header>
  );
}
