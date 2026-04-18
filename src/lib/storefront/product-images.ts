/**
 * LOCAL-ONLY product images — served from `/public/images/products/*.jpg`.
 * Do not construct paths from arbitrary slugs; every asset must exist on disk and be listed here
 * (or resolve to `PRODUCT_IMAGE_FALLBACK`). This avoids 404s and mixed remote/local behavior.
 */

export const PRODUCT_IMAGE_FALLBACK = "/images/products/fallback.jpg" as const;

/**
 * Every storefront product slug used in seed/UI maps to an on-disk JPEG path.
 * PDP `/product/[slug]` uses the same map; unknown slugs get the fallback (never a bad path).
 */
export const PRODUCT_LOCAL_IMAGE_BY_SLUG = {
  "luna-halo-ring": "/images/products/luna-halo-ring.jpg",
  "noir-sapphire-pendant": "/images/products/noir-sapphire-pendant.jpg",
  "aurelia-link-bracelet": "/images/products/aurelia-link-bracelet.jpg",
  "etoile-diamond-studs": "/images/products/etoile-diamond-studs.jpg",
  "pearl-sculpt-drop-earrings": "/images/products/pearl-sculpt-drop-earrings.jpg",
  "vesper-tennis-bracelet": "/images/products/vesper-tennis-bracelet.jpg",
  "solstice-charm-necklace": "/images/products/solstice-charm-necklace.jpg",
  "atelier-pearl-collar": "/images/products/atelier-pearl-collar.jpg",
  /** Name-only card (no slug) in collections — file base matches */
  "orion-signet": "/images/products/orion-signet.jpg",
  "orion-signet-ring": "/images/products/orion-signet.jpg"
} as const satisfies Record<string, string>;

export type ProductImageSlug = keyof typeof PRODUCT_LOCAL_IMAGE_BY_SLUG;

/** PDP / cards without slug but with known display name */
const PRODUCT_NAME_TO_KEY: Partial<Record<string, ProductImageSlug>> = {
  "Orion Signet Ring": "orion-signet"
};

export function resolveProductImageUrl(slug?: string, productName?: string): string {
  if (slug && Object.hasOwn(PRODUCT_LOCAL_IMAGE_BY_SLUG, slug)) {
    return PRODUCT_LOCAL_IMAGE_BY_SLUG[slug as ProductImageSlug];
  }
  const nameKey = productName ? PRODUCT_NAME_TO_KEY[productName] : undefined;
  if (nameKey) {
    return PRODUCT_LOCAL_IMAGE_BY_SLUG[nameKey];
  }
  return PRODUCT_IMAGE_FALLBACK;
}
