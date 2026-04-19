"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudioBrandMark, JewelryAdminBrandMark } from "@/components/brand/brand-marks";
import { studioNavItems } from "@/components/layouts/studio-navigation";
import { cn } from "@/lib/utils/cn";

type StudioSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function StudioSidebar({ className, onNavigate }: StudioSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-[17rem] shrink-0 border-r border-[#e7dfd3] bg-[#f6f1e9] p-4", className)}>
      <div className="rounded-lg border border-[#e7dfd3] bg-white p-3.5 shadow-[0_6px_20px_rgba(20,18,23,0.05)]">
        <div className="flex items-start gap-3">
          <StudioBrandMark className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7b4b]">LuxeFlow</p>
            <h2 className="mt-1 font-display text-heading-lg text-[#231d16]">Studio</h2>
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#7f7263]">
              Marketing, campaigns, and storefront content tools.
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1">
        {studioNavItems.map((link) => {
          const isActive =
            link.href === "/studio"
              ? pathname === "/studio" || pathname === "/studio/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href as Route}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg border px-3 py-2.5 transition-all duration-300 ease-premium",
                isActive
                  ? "border-[#d5b98f] bg-white shadow-[0_8px_22px_rgba(20,18,23,0.07)]"
                  : "border-transparent bg-transparent hover:border-[#e7dfd3] hover:bg-white/80"
              )}
            >
              <p className={cn("text-[13px] font-semibold leading-snug", isActive ? "text-[#302419]" : "text-[#514739]")}>
                {link.label}
              </p>
              <p className={cn("mt-0.5 line-clamp-2 text-[11px] leading-relaxed", isActive ? "text-[#7d6547]" : "text-[#8a7b69]")}>
                {link.description}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-[#e7dfd3] pt-4">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9b7b4b]">Operations</p>
        <Link
          href={"/admin/login" as Route}
          onClick={onNavigate}
          className="mt-2 flex gap-3 rounded-lg border border-[#dfd3c4] bg-white/90 px-3 py-2.5 shadow-sm transition-colors hover:border-[#c9a66b]/70 hover:bg-white"
        >
          <JewelryAdminBrandMark className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-snug text-[#302419]">Jewelry Admin</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#7d6547]">Inventory, suppliers, B2B — sign in</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
