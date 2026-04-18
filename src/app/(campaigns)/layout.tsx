import type { ReactNode } from "react";
import { StorefrontShell } from "@/components/layouts/storefront-shell";

export default function CampaignsLayout({ children }: { children: ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
