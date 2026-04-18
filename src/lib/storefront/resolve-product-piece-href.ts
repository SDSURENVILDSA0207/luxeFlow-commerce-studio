import type { Route } from "next";
import type { CollectionProduct } from "@/lib/storefront/collections-data";

const CATEGORY_TO_COLLECTION_HASH: Record<CollectionProduct["category"], string> = {
  Rings: "rings",
  Necklaces: "necklaces",
  Bracelets: "bracelets",
  Earrings: "earrings"
};

/** Display names that map to a PDP slug when `slug` is omitted in seed data */
const PRODUCT_NAME_TO_SLUG: Record<string, string> = {
  "Orion Signet Ring": "orion-signet-ring"
};

export type ResolveProductPieceHrefInput = {
  name: string;
  slug?: string;
  href?: string;
  category?: CollectionProduct["category"];
};

/**
 * Resolves storefront destination for a product card: explicit href → PDP slug →
 * known name map → category collection anchor → catalog.
 */
export function resolveProductPieceHref({
  name,
  slug,
  href,
  category
}: ResolveProductPieceHrefInput): Route {
  if (href) return href as Route;
  const s = slug?.trim();
  if (s) return `/product/${s}` as Route;
  const fromName = PRODUCT_NAME_TO_SLUG[name];
  if (fromName) return `/product/${fromName}` as Route;
  if (category) {
    const hash = CATEGORY_TO_COLLECTION_HASH[category];
    return `/collections#${hash}` as Route;
  }
  return "/products" as Route;
}
