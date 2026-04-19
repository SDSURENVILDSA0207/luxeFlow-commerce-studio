import { catalogProducts, type CatalogProduct } from "@/lib/storefront/products-catalog-data";

export function getCatalogProductBySlug(slug: string): CatalogProduct | undefined {
  const s = slug.trim().toLowerCase();
  return catalogProducts.find((p) => p.slug === s);
}

/** Up to `limit` other products for PDP / cross-sells */
export function getRelatedCatalogProducts(currentSlug: string, limit = 3): CatalogProduct[] {
  return catalogProducts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
