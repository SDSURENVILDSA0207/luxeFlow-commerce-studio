import type { ContentBlock } from "@/modules/cms/types";

export const seedContentBlocks: ContentBlock[] = [
  {
    id: "block-hero-home",
    name: "Homepage Hero",
    type: "homepage-hero",
    status: "published",
    page: "/",
    headline: "Jewelry crafted to be worn now and cherished for decades.",
    body: "Discover a modern high-jewelry experience blending artisanal craftsmanship and exclusive seasonal drops.",
    badgeText: "Spring Signature 2026",
    ctaLabel: "Shop Bestsellers",
    ctaUrl: "/products",
    updatedAt: "2026-04-16T13:20:00.000Z"
  },
  {
    id: "block-promo-bridal",
    name: "Bridal Promotion Banner",
    type: "promotional-banner",
    status: "draft",
    page: "/c/spring-bridal-event",
    headline: "Complimentary silk jewelry case on orders above $1,500.",
    body: "Limited seasonal campaign to increase average order value while elevating gifting experiences.",
    badgeText: "Private Client Offer",
    ctaLabel: "Shop the Offer",
    ctaUrl: "/c/spring-bridal-event",
    updatedAt: "2026-04-16T15:05:00.000Z"
  },
  {
    id: "block-featured-collection",
    name: "Featured Collection Spotlight",
    type: "featured-collection",
    status: "published",
    page: "/collections",
    headline: "Signature edits designed for modern collectors.",
    body: "Seasonal collection storytelling block featuring capsule products and campaign-driven merchandising.",
    badgeText: "Featured Collections",
    ctaLabel: "Explore Collections",
    ctaUrl: "/collections",
    updatedAt: "2026-04-16T10:40:00.000Z"
  },
  {
    id: "block-cta-newsletter",
    name: "Newsletter CTA Section",
    type: "cta-section",
    status: "published",
    page: "/",
    headline: "Join the LuxeFlow inner circle for early access.",
    body: "Receive launch previews, styling notes, and invitation-only offers created for high-intent shoppers.",
    badgeText: "Campaign Newsletter",
    ctaLabel: "Subscribe",
    ctaUrl: "/#newsletter",
    updatedAt: "2026-04-16T11:50:00.000Z"
  },
  {
    id: "block-landing-story",
    name: "Campaign Story Section",
    type: "landing-section",
    status: "draft",
    page: "/c/new-arrivals-collection",
    headline: "Designed for now, meant for a lifetime.",
    body: "Each arrival blends editorial-inspired form with heirloom-grade craftsmanship, so clients can collect with confidence.",
    badgeText: "Campaign Story",
    ctaLabel: "Explore New Arrivals",
    ctaUrl: "/c/new-arrivals-collection",
    updatedAt: "2026-04-16T14:25:00.000Z"
  }
];
