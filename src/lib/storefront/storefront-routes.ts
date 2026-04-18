import type { Route } from "next";

/** Primary category anchors — aligned with `categoryAnchors` / collection sections */
export const storefrontCategoryPaths = {
  rings: "/collections#rings",
  necklaces: "/collections#necklaces",
  bracelets: "/collections#bracelets",
  earrings: "/collections#earrings"
} as const satisfies Record<string, Route>;

export const shopMegaMenuCategories = [
  { label: "Rings", href: storefrontCategoryPaths.rings },
  { label: "Necklaces", href: storefrontCategoryPaths.necklaces },
  { label: "Bracelets", href: storefrontCategoryPaths.bracelets },
  { label: "Earrings", href: storefrontCategoryPaths.earrings }
] as const;

export const campaignNavLinks = [
  { label: "Spring Bridal Event", href: "/c/spring-bridal-event" as Route },
  { label: "New Arrivals", href: "/c/new-arrivals-collection" as Route },
  { label: "Holiday Gift Guide", href: "/c/holiday-gift-guide" as Route }
] as const;

/** Single source for header Shop + Campaigns — desktop dropdowns and mobile accordions */
export const storefrontNavShopDiscover = [
  { label: "All collections", href: "/collections" as Route },
  { label: "All pieces", href: "/products" as Route }
] as const;

export const storefrontNavShopFeatured = {
  label: "Spring Bridal Event",
  href: "/c/spring-bridal-event" as Route,
  description: "Limited edits, concierge styling, and gift-ready packaging."
} as const;

export const homeFeaturedCategories = [
  {
    title: "Rings",
    description: "Diamond solitaires, signets, and sculpted silhouettes.",
    highlight: "Iconic Cuts",
    href: storefrontCategoryPaths.rings
  },
  {
    title: "Necklaces",
    description: "Layered gold chains and heritage statement pieces.",
    highlight: "Everyday Heirlooms",
    href: storefrontCategoryPaths.necklaces
  },
  {
    title: "Bracelets",
    description: "Cuffs and delicate links built for refined stacking.",
    highlight: "Modern Stacks",
    href: storefrontCategoryPaths.bracelets
  },
  {
    title: "Earrings",
    description: "Studs, drops, and polished forms with balanced shine.",
    highlight: "Artisan Detail",
    href: storefrontCategoryPaths.earrings
  }
] as const;

export const homeFeaturedCollections = [
  {
    name: "Celestial Gold",
    season: "Spring Edit",
    description: "Soft gold tones with clean, luminous geometry.",
    href: "/collections" as Route
  },
  {
    name: "Midnight Sapphire",
    season: "Limited Capsule",
    description: "Deep stones paired with understated metalwork.",
    href: "/c/spring-bridal-event" as Route
  },
  {
    name: "Pearl Atelier",
    season: "New Arrival",
    description: "Contemporary pearl forms with modern sculptural settings.",
    href: "/c/new-arrivals-collection" as Route
  }
] as const;

/** Homepage trust tiles — each maps to a real storefront or concierge destination */
export const homeTrustPoints = [
  {
    title: "Ethically Sourced Stones",
    description: "Every diamond and gemstone is verified through responsible sourcing and traceable suppliers.",
    href: "/collections" as Route,
    cta: "Explore collections"
  },
  {
    title: "Lifetime Craft Care",
    description: "Complimentary polishing, prong checks, and annual maintenance for every LuxeFlow piece.",
    href: "/products" as Route,
    cta: "View care & products"
  },
  {
    title: "Private Styling Concierge",
    description: "Dedicated virtual appointments to curate pairings for gifting, events, and milestone moments.",
    href: "/c/spring-bridal-event" as Route,
    cta: "Book a campaign consult"
  }
] as const;

export type ConciergeQuickAction =
  | { label: string; href: Route }
  | { label: string; href: string; external: true };

/**
 * Concierge-style quick actions (reference: utility/help depth on commerce sites).
 * Each navigates to a real route or opens mailto.
 */
export const conciergeQuickActions: ConciergeQuickAction[] = [
  { label: "Shop rings", href: storefrontCategoryPaths.rings },
  { label: "New arrivals campaign", href: "/c/new-arrivals-collection" as Route },
  { label: "Full catalog", href: "/products" as Route },
  {
    label: "Email concierge",
    href: "mailto:concierge@luxeFlow.studio?subject=LuxeFlow%20styling%20request",
    external: true
  }
];
