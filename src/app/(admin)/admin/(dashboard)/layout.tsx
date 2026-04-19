import type { ReactNode } from "react";
import { InventoryAdminShell } from "@/components/layouts/inventory-admin-shell";

export default function InventoryDashboardLayout({ children }: { children: ReactNode }) {
  return <InventoryAdminShell>{children}</InventoryAdminShell>;
}
