"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { InventoryAdminSidebar } from "@/components/layouts/inventory-admin-sidebar";
import { InventoryAdminTopbar } from "@/components/layouts/inventory-admin-topbar";

type InventoryAdminShellProps = {
  children: ReactNode;
};

export function InventoryAdminShell({ children }: InventoryAdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eceff1] text-[#263238]">
      <a
        href="#jewelry-admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#263238] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#90a4ae] focus:ring-offset-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-screen min-w-0 max-w-[1600px]">
        <InventoryAdminSidebar className="hidden lg:block" />

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
              onClick={() => setSidebarOpen(false)}
            />
            <InventoryAdminSidebar
              id="jewelry-admin-mobile-nav"
              className="relative z-10 h-full max-h-[100dvh] min-w-0 max-w-[min(20rem,92vw)] overflow-y-auto overscroll-contain border-r border-[#cfd8dc] bg-[#f4f6f8] shadow-xl"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <InventoryAdminTopbar mobileNavOpen={sidebarOpen} onToggleMenu={() => setSidebarOpen((v) => !v)} />
          <main
            id="jewelry-admin-main"
            tabIndex={-1}
            className="min-w-0 flex-1 scroll-mt-20 overflow-x-auto px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
