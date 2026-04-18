"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/components/layouts/admin-navigation";
import { cn } from "@/lib/utils/cn";

type AdminSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-80 border-r border-[#e7dfd3] bg-[#f6f1e9] p-5", className)}>
      <div className="rounded-xl border border-[#e7dfd3] bg-white p-4 shadow-[0_8px_24px_rgba(20,18,23,0.06)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7b4b]">LuxeFlow</p>
        <h2 className="mt-1 font-display text-heading-lg text-[#231d16]">Commerce Studio</h2>
        <p className="mt-1 text-body-sm text-[#7f7263]">Luxury operations for design, marketing, and e-commerce teams.</p>
      </div>

      <nav className="mt-5 space-y-1">
        {adminNavItems.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href as Route}
              onClick={onNavigate}
              className={cn(
                "block rounded-xl border px-4 py-3 transition-all duration-300 ease-premium",
                isActive
                  ? "border-[#d5b98f] bg-white shadow-[0_10px_26px_rgba(20,18,23,0.08)]"
                  : "border-transparent bg-transparent hover:border-[#e7dfd3] hover:bg-white/80"
              )}
            >
              <p className={cn("text-body-sm font-semibold", isActive ? "text-[#302419]" : "text-[#514739]")}>{link.label}</p>
              <p className={cn("mt-1 text-[12px] leading-5", isActive ? "text-[#7d6547]" : "text-[#8a7b69]")}>
                {link.description}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
