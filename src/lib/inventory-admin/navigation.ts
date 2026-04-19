import type { Route } from "next";

export type InventoryAdminNavItem = {
  href: Route;
  label: string;
  description: string;
};

export const inventoryAdminNavItems: InventoryAdminNavItem[] = [
  { href: "/admin", label: "Overview", description: "Inventory and trade snapshot." },
  { href: "/admin/inventory", label: "Inventory", description: "SKUs, stock, materials, and suppliers." },
  { href: "/admin/suppliers", label: "Suppliers", description: "Vendor contacts and lead times." },
  { href: "/admin/customers", label: "B2B customers", description: "Retailer accounts and status." },
  { href: "/admin/quotes", label: "Quotes", description: "Draft through accepted trade quotes." },
  { href: "/admin/orders", label: "Orders", description: "Fulfillment and order lifecycle." }
];

type RouteMeta = { title: string; description: string };

const meta: Record<string, RouteMeta> = {
  "/admin": {
    title: "Jewelry operations",
    description: "Inventory, suppliers, and B2B trade overview."
  },
  "/admin/inventory": {
    title: "Inventory",
    description: "SKU-level stock, materials, and reorder signals."
  },
  "/admin/suppliers": {
    title: "Suppliers",
    description: "Atelier and vendor relationships."
  },
  "/admin/customers": {
    title: "B2B customers",
    description: "Retailer and jeweler accounts."
  },
  "/admin/quotes": {
    title: "Quotes",
    description: "Trade quotes and commercial terms."
  },
  "/admin/orders": {
    title: "Orders",
    description: "Production and fulfillment pipeline."
  }
};

export function getInventoryAdminRouteMeta(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/$/, "") || "/admin";
  if (meta[normalized]) return meta[normalized];
  if (pathname.startsWith("/admin/inventory")) return meta["/admin/inventory"];
  if (pathname.startsWith("/admin/suppliers")) return meta["/admin/suppliers"];
  if (pathname.startsWith("/admin/customers")) return meta["/admin/customers"];
  if (pathname.startsWith("/admin/quotes")) return meta["/admin/quotes"];
  if (pathname.startsWith("/admin/orders")) return meta["/admin/orders"];
  return meta["/admin"];
}
