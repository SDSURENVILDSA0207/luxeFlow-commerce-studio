"use client";

import type { Route } from "next";
import Link from "next/link";
import { JewelryAdminBrandMark, StudioBrandMark } from "@/components/brand/brand-marks";

export function AdminLoginHero() {
  return (
    <>
      <div className="flex justify-center">
        <JewelryAdminBrandMark className="h-12 w-12" />
      </div>
      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[#607d8b]">LuxeFlow</p>
      <h1 className="mt-1 text-center font-display text-2xl text-[#263238]">Jewelry Admin</h1>
      <p className="mt-2 text-center text-sm text-[#546e7a]">Sign in to access inventory, suppliers, and B2B trade tools.</p>
    </>
  );
}

export function AdminLoginFooterLinks() {
  return (
    <p className="mt-8 flex flex-col items-center gap-3 text-center text-xs text-[#78909c] sm:flex-row sm:justify-center sm:gap-2">
      <Link
        href={"/" as Route}
        className="inline-flex items-center gap-1.5 font-medium text-[#455a64] underline-offset-2 hover:underline"
      >
        Back to storefront
      </Link>
      <span className="hidden sm:inline" aria-hidden>
        ·
      </span>
      <Link
        href={"/studio" as Route}
        className="inline-flex items-center gap-1.5 font-medium text-[#455a64] underline-offset-2 hover:underline"
      >
        <StudioBrandMark className="h-4 w-4" />
        Studio
      </Link>
    </p>
  );
}
