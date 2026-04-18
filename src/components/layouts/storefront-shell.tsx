import type { ReactNode } from "react";
import { ConciergePrompts } from "@/components/storefront/concierge-prompts";
import { StorefrontNav } from "@/components/storefront/storefront-nav";

type StorefrontShellProps = {
  children: ReactNode;
};

export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <div className="storefront-editorial min-h-screen text-foreground">
      <StorefrontNav />
      <main className="mx-auto w-full min-w-0 max-w-[1400px] overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
        {children}
      </main>
      <ConciergePrompts />
    </div>
  );
}
