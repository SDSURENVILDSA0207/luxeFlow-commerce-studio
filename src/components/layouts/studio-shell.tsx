"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { StudioSidebar } from "@/components/layouts/studio-sidebar";
import { StudioTopbar } from "@/components/layouts/studio-topbar";

type StudioShellProps = {
  children: ReactNode;
};

export function StudioShell({ children }: StudioShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f9f5ee] text-[#2a2219]">
      <div className="mx-auto flex min-h-screen min-w-0 max-w-[1440px] border-x border-[#e7dfd3] bg-[#fbf7f1]">
        <StudioSidebar className="hidden lg:block" />

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-[#241c14]/30 backdrop-blur-[1px]"
              onClick={() => setIsSidebarOpen(false)}
            />
            <StudioSidebar
              className="relative z-10 h-full max-h-[100dvh] min-w-0 max-w-[min(20rem,92vw)] overflow-y-auto overscroll-contain shadow-[8px_0_32px_rgba(20,18,12,0.12)]"
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <StudioTopbar onToggleMenu={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="min-w-0 flex-1 px-4 py-5 sm:px-5 sm:py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
