"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JewelryAdminBrandMark } from "@/components/brand/brand-marks";
import { inventoryAdminNavItems } from "@/lib/inventory-admin/navigation";
import { cn } from "@/lib/utils/cn";

type InventoryAdminSidebarProps = {
  id?: string;
  className?: string;
  onNavigate?: () => void;
};

export function InventoryAdminSidebar({ id, className, onNavigate }: InventoryAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside id={id} className={cn("w-[17rem] shrink-0 border-r border-[#dfe6e9] bg-[#f4f6f8] p-4", className)}>
      <div className="rounded-lg border border-[#cfd8dc] bg-white p-3.5 shadow-sm">
        <div className="flex items-start gap-3">
          <JewelryAdminBrandMark className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#546e7a]">Operations</p>
            <h2 className="mt-1 font-display text-heading-lg text-[#263238]">Jewelry Admin</h2>
            <p className="mt-1 text-[12px] leading-snug text-[#607d8b]">Inventory, suppliers, B2B trade.</p>
          </div>
        </div>
      </div>

      <nav className="mt-4 space-y-1" aria-label="Admin">
        {inventoryAdminNavItems.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "block min-h-[2.75rem] rounded-lg border px-3 py-2.5 transition-colors duration-200",
                isActive
                  ? "border-[#90a4ae] bg-white shadow-sm"
                  : "border-transparent hover:border-[#cfd8dc] hover:bg-white/90"
              )}
            >
              <p className={cn("text-[13px] font-semibold leading-snug", isActive ? "text-[#263238]" : "text-[#455a64]")}>
                {link.label}
              </p>
              <p className={cn("mt-0.5 line-clamp-2 text-[11px] leading-relaxed", isActive ? "text-[#546e7a]" : "text-[#78909c]")}>
                {link.description}
              </p>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
